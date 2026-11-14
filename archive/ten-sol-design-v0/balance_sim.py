# ARCHIVED: balance model for the retired ten-sol design. The active check is tools/check_story_data.mjs.
"""Archived balance check: enumerate decisions in the retired design.
AI-assisted original: Anthropic Claude; English annotations: OpenAI ChatGPT/Codex.
See AI_USAGE.md and ai-usage.json at the repository root.
Historical internal keys are retained to preserve model behavior.
"""
import itertools, collections

START = dict(E=6, O=7, Y=6, G=7, B=0)
SUN = {1: 'acik', 2: 'acik', 3: 'tozlu', 4: 'firtina', 5: 'tozlu',
       6: 'acik', 7: 'acik', 8: 'acik', 9: 'acik', 10: 'acik'}
PROD = {'acik': 4, 'tozlu': 2, 'firtina': 1}
SCIENCE_GOAL, STAR_GOAL = 6, 9


def clamp(s):
    for k in 'EOYG':
        s[k] = max(0, min(10, s[k]))


def options(sol, s, f):
    """Return choices for a sol: (internal name, resource effects, flags)."""
    lab = 1 if f.get('lab') else 0
    if sol == 1:
        return [('sera', dict(E=-2), {'sera_sol': 1}),
                ('lab', dict(E=-1, B=1), {'lab': True}),
                ('robot', dict(E=-1), {'robot': True})]
    if sol == 2:
        return [('dis_gorev', dict(E=-1, O=-1, G=-1, B=2), {}),
                ('rover', dict(E=-2, B=1 + lab), {}),
                ('bakim', dict(G=1), {})]
    if sol == 3:
        o = [('enerji_biriktir', dict(E=1), {}),
             ('arastir', dict(E=-1, B=1 + lab), {}),
             ('dunyaya_sor', dict(E=-1), {'panel_ayari': True})]
        if 'sera_sol' not in f:
            o.append(('gec_sera', dict(E=-2), {'sera_sol': 3}))
        return o
    if sol == 4:
        o = [('normal_mod', {}, {}),
             ('tasarruf_modu', {}, {'eko': {4, 5}})]
        if 'sera_sol' in f:
            o.append(('serayi_dinlendir', {}, {'sera_kapali': 4}))
        else:
            o.append(('isiticilari_kis', dict(E=1, G=-1), {}))
        return o
    if sol == 5:
        return [('dunyaya_sor', dict(E=-1), {'dunya_cevap': True}),
                ('kalkan_simdi', dict(E=-2), {'kalkan': True}),
                ('gorevde_kal', dict(E=-1, O=-1, B=2), {})]
    if sol == 6:
        cost = -1 if f.get('dunya_cevap') else -2
        o = [('analiz', dict(E=-1, B=1 + lab), {}),
             ('dinlen', dict(G=1), {})]
        if not f.get('kalkan'):
            o.insert(0, ('kalkan_kur', dict(E=cost), {'kalkan': True}))
        return o
    if sol == 7:
        k = f.get('kalkan')
        return [('siginak', dict(G=0 if k else -2), {}),
                ('dis_olcum', dict(E=-1, O=-1, G=-3, B=3), {}),
                ('icerde_calis', dict(E=-1, G=-1 if k else -3, B=1 + lab), {})]
    if sol == 8:
        return [('hemen_onar', dict(E=-2), {}),
                ('dunyaya_sor', dict(E=-1, O=-2), {'oto_onarim_9': True}),
                ('ertele', dict(E=-1, B=2), {'ariza': True})]
    if sol == 9:
        o = [('uzak_krater', dict(E=-2, O=-1, G=-1, B=3), {}),
             ('yakin_ornek', dict(E=-1, B=1 + lab), {}),
             ('dinlen', dict(G=1, E=1), {})]
        if f.get('ariza'):
            o.append(('simdi_onar', dict(E=-2), {'ariza': False}))
        return o
    if sol == 10:
        return [('tam_veri', dict(E=-2, B=2), {}),
                ('ozet_veri', dict(E=-1, B=1), {}),
                ('guvenli_kapat', dict(G=1), {})]


def run(path):
    s, f = dict(START), {}
    for sol in range(1, 11):
        # 1) Production
        w = SUN[sol]
        p = PROD[w]
        if f.get('robot') and w == 'tozlu':
            p += 2
        elif w != 'acik' and (f.get('robot') or (f.get('panel_ayari') and sol in (4, 5))):
            p += 1
        s['E'] += p
        clamp(s)
        # 2) Decision
        opts = options(sol, s, f)
        i = path[sol - 1]
        if i >= len(opts):
            return None
        name, eff, flags = opts[i]
        if s['E'] + eff.get('E', 0) < 0:
            return None  # Disabled: insufficient Energy
        for k, v in eff.items():
            s[k] += v
        f.update(flags)
        # 3) Shared consumption: life support
        eko = sol in f.get('eko', set())
        need = 1 if eko else 2
        if s['E'] >= need:
            s['E'] -= need
            s['O'] += -1 if eko else 0
        else:
            s['O'] -= 2  # Life support stopped
        # Fault: oxygen generator offline
        if f.get('ariza') and sol >= 8:
            s['O'] -= 2
        if f.get('oto_onarim_9') and sol == 9:
            s['E'] -= 1
        # Greenhouse
        if 'sera_sol' in f and f.get('sera_kapali') != sol:
            if s['E'] >= 1:
                s['E'] -= 1
                ready = f['sera_sol'] + 3 + (1 if 'sera_kapali' in f else 0)
                if sol >= ready:
                    s['Y'] += 1
        # Food
        s['Y'] -= 1
        if s['Y'] < 0:
            s['Y'] = 0
            s['G'] -= 1
        clamp(s)
        if s['O'] <= 0:
            return ('kayip_oksijen', sol, s)
        if s['G'] <= 0:
            return ('kayip_guvenlik', sol, s)
    if s['B'] >= STAR_GOAL:
        return ('yildiz', 10, s)
    if s['B'] >= SCIENCE_GOAL:
        return ('basari', 10, s)
    return ('kismi', 10, s)


res = collections.Counter()
by_first = collections.defaultdict(collections.Counter)
best = []
for path in itertools.product(range(4), repeat=10):
    r = run(path)
    if r is None:
        continue
    res[r[0]] += 1
    by_first[path[0]][r[0]] += 1
    if r[0] in ('basari', 'yildiz'):
        best.append((r[2]['B'], path))

print('Results:', dict(res))
for k, v in sorted(by_first.items()):
    print(' Sol 1 option', k, dict(v))
print('Maximum Science:', max(best)[0] if best else None)

# Example strategies
named = {
    'always safe': (0, 2, 0, 0, 1, 0, 0, 0, 2, 2),
    'greedy science': (1, 0, 1, 0, 2, 1, 1, 2, 0, 0),
    'balanced greenhouse': (0, 1, 1, 0, 0, 0, 0, 0, 1, 0),
    'balanced lab': (1, 0, 2, 0, 1, 1, 0, 0, 0, 0),
    'always ask Earth': (0, 1, 2, 0, 0, 0, 0, 1, 1, 0),
    'robot + science': (2, 0, 1, 0, 1, 1, 0, 0, 0, 0),
}
for n, p in named.items():
    print(n, run(p))
