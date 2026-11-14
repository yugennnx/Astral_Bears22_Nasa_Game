"""AI-assisted source verification: OpenAI ChatGPT/Codex.

See AI_USAGE.md and ai-usage.json. Uses original NASA/PDS records with TLS
verification enabled; it does not certify all science or competition eligibility.
"""
import argparse
import csv
import hashlib
import io
import json
import pathlib
import urllib.request
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

ROOT = pathlib.Path(__file__).resolve().parents[1]


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def retrieve(url, cache_dir, cache_name):
    if cache_dir is not None and (cache_dir / cache_name).is_file():
        return (cache_dir / cache_name).read_bytes()
    request = urllib.request.Request(url, headers={"User-Agent": "AstralBears22-source-check/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def verify_meda(cache_dir):
    data = read_json(ROOT / "data/meda-jezero.json")
    for item in data["sols"]:
        raw = retrieve(item["file"], cache_dir, f"meda-sol-{item['sol']}.csv")
        digest = hashlib.sha256(raw).hexdigest()
        if digest != item["sourceFileSha256"]:
            raise ValueError(f"MEDA source snapshot differs for Sol {item['sol']}; review before updating its receipt")
        rows = csv.DictReader(io.StringIO(raw.decode("utf-8-sig")))
        if "ATS_LOCAL_TEMP1" not in (rows.fieldnames or []):
            raise ValueError("Expected MEDA sensor column is absent")
        samples = []
        for row in rows:
            try:
                kelvin = Decimal(row["ATS_LOCAL_TEMP1"])
            except (InvalidOperation, TypeError):
                continue
            if kelvin.is_finite() and 100 < kelvin < 400:
                samples.append(kelvin - Decimal("273.15"))
        if not samples:
            raise ValueError(f"No usable MEDA samples for Sol {item['sol']}")
        extrema = [float(value.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))
                   for value in (min(samples), max(samples))]
        if extrema != [item["airTemp_minC"], item["airTemp_maxC"]]:
            raise ValueError(f"MEDA summary mismatch for Sol {item['sol']}: {extrema}")
        if len(samples) != item["validSampleCount"]:
            raise ValueError(f"MEDA sample count mismatch for Sol {item['sol']}")
        print(f"MEDA Sol {item['sol']}: {extrema} Celsius, {len(samples)} samples; source hash verified.")


def verify_donki(cache_dir):
    data = read_json(ROOT / "data/nasa-events.json")
    curated = data["events"][0]
    raw = retrieve(curated["apiUrl"], cache_dir, "donki-cme-2024-05-20.json")
    records = json.loads(raw)
    original = next(item for item in records if item["activityID"] == curated["id"])
    if original["startTime"] != curated["startTime"]:
        raise ValueError("DONKI event start time differs")
    analyses = [item for item in original["cmeAnalyses"] if item["isMostAccurate"]]
    keys = ("speed", "latitude", "longitude", "halfAngle", "featureCode")
    observed = [{key: item[key] for key in keys} for item in analyses]
    if observed != curated["analyses_most_accurate"]:
        raise ValueError("DONKI most-accurate analyses differ; review current catalogue")
    print(f"DONKI {curated['id']}: start time and distinct shock/bulk analyses verified.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cache-dir", type=pathlib.Path,
                        help="Read previously downloaded original source snapshots when available")
    args = parser.parse_args()
    verify_meda(args.cache_dir)
    verify_donki(args.cache_dir)
    print("Selected source checks passed. Additional MEDA quality flags are not applied; no Mars-event match or dose-to-Safety model is asserted.")


if __name__ == "__main__":
    main()
