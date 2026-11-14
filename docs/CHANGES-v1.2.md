# Değişiklik Raporu — v1.2

**Tarih:** 14 Kasım 2026 · **Önceki sürüm:** commit `51431a5` (story plan v1.1 + scenes.js)
**Amaç:** Arkadaşımızın incelemesi için. Her değişikliğin *neden* yapıldığı ve *nasıl doğrulandığı* yazılı. Katılmadığın bir yer olursa bu dosyaya not düşebilir veya geri alabiliriz.

---

## Özet

| # | Değişiklik | Dosyalar | Oyun dengesine etkisi |
|---|---|---|---|
| 1 | 2017 güneş olayı kaldırıldı, yerine kendi indirdiğimiz **Mayıs 2024 DONKI** kaydı ve **MEDA** sıcaklık verisi kondu | `scenes.js`, `story-plan.md` | Yok (yalnızca bilgi kartları) |
| 2 | Eski 10 sollu tasarım arşive taşındı | `archive/ten-sol-design-v0/`, `README.md` | Yok |
| 3 | **Düşük güçte yaşam desteği** kuralı (enerji ↔ oksijen bağı) | `scenes.js`, `story-plan.md`, checker | Standart profilde sonuç değişmiyor |
| 4 | **Görev profilleri** (kontrollü rastgelelik / tekrar oynanabilirlik) | `scenes.js`, `story-plan.md`, checker | Yeni profiller daha zor; hepsi kazanılabilir |
| 5 | **Gelecek ekip raporu** (yiyecek üretiminin uzun vadeli sonucu) | `scenes.js`, `story-plan.md`, contract | Yok (yalnızca son rapor) |
| 6 | Test aracı yeni kurallara ve 3 profile göre güncellendi | `tools/check_story_data.mjs` | — |
| 7 | Node.js 26.13.1 (LTS) Tuğra'nın bilgisayarına kuruldu | — | — |

Standart profilde oyunun bütün sayıları **v1.1 ile birebir aynı**: 103 başarılı, 219 kısmi, 41 erken durma; 5 örnek yolun hepsi aynı sonucu veriyor.

---

## 1. NASA verisi: 2017 → 2024 DONKI + MEDA

**Neden:** Takım kararı: oyunda kendi indirdiğimiz ve dosyada sakladığımız gerçek veriler kullanılacak. Challenge kuralları "en az bir gerçek NASA verisi oyun içinde anlamlı kullanılmalı" diyor. v1.1 planı DONKI kaydının indirilmediğini kendisi de yazıyordu.

**Ne değişti:**
- **Sahne 5 bilgi kartı:** DONKI `2024-05-20T05:36:00-CME-001` + NASA'nın Curiosity RAD ölçümü (8.100 mikrogray ≈ 30 göğüs röntgeni). Kartta bir `dataNote` var: DONKI kaydı Mars'tan bahsetmiyor, eşleştirme bizim yorumumuz. Bu not jüriye karşı dürüstlük için önemli, lütfen arayüzde "detaylar" kısmında göster.
- **Sahne 2 için yeni bilgi kartı:** Perseverance MEDA, Sol 290 (13 Aralık 2021): en sıcak yaklaşık −3 °C, en soğuk yaklaşık −77 °C. "Güç sıkıntısı" sahnesine bağlandı: gece batarya ve ısıtıcı neden önemli?
- **`NASA_SOURCES`:** `solar-event-2017` ve `radiation-graphic-2017` silindi. `donki-cme-2024-05-20`, `mars-solar-storm-2024` ve `meda-pds-bundle` eklendi. Her kaynakta yerel dosya yolu (`localData`) var.
- **MEDA linki:** Test aracı yalnızca `*.nasa.gov` adreslerini kabul ediyor. Ham MEDA dosyaları ise `pds-atmospheres.nmsu.edu` adresinde (NASA'nın PDS Atmosfer düğümü). Takım kararıyla kaynak olarak NASA'nın resmi PDS sayfası (`pds.nasa.gov/.../mars2020_meda`) kullanıldı. Bu sayfa ham veriye bağlantı veriyor. Test kuralı **değiştirilmedi**. Dosya bazlı tam linkler `data/meda_jezero.json` içinde duruyor.

**Kontrol edilmesi gereken:** Metinler 7–12 yaş için uygun uzunlukta mı? Sahne 5 kartı biraz uzun, kısaltılabilir.

## 2. Eski tasarım arşivlendi

**Neden:** README "iki tasarımdan birini seçin" diyordu. Karar verildi: story plan geçerli.
**Ne değişti:** `GAME_DESIGN.md` ve `tools/balance_sim.py`, `archive/ten-sol-design-v0/` klasörüne taşındı ve başlarına "ARŞİV" notu eklendi. Dosyalar silinmedi, çünkü NASA veri araştırması ve tasarım geçmişi orada. README güncellendi: başlık artık *Compass Outpost*, geçerli kural seti açıkça yazılı. `data/` klasörü yerinde kaldı, oyun bu verileri kullanıyor.

## 3. Düşük güçte yaşam desteği

**Neden (Kural 6 ve 13):** Kural "yaşam desteğine az enerji ayırmanın sonraki günlerde sonucu olmalı" diyor. v1.1'de enerji azalınca oksijen kendiliğinden etkilenmiyordu. İki kaynak arasındaki bağ yalnızca "oksijen üret" seçenekleriyle kuruluyordu.

**Kural:** Kararın ardından enerji **2 veya altındaysa**, geçişte oksijen −1 yerine **−2** düşer. DUTİ uyarısı: *"Battery very low! Life support runs in low-power mode, so we lose 1 extra Oxygen."* Bu uyarı tahmin satırında seçimden *önce* gösterilmeli.

**Etkisi:** Standart profilde 4 yolun son değerleri değişiyor ama hiçbir yolun sonucu (başarı / kısmi / durma) değişmiyor. Kural, çocuğa nedensellik öğreten bir mekanik olarak var. Oyunu zorlaştırmıyor.

**Tartışılabilir:** Eşik 1 mi olsun 2 mi? 2 seçildi, çünkü 1–3 arası zaten "kritik" uyarı bandında ve 2 ile kural daha sık görünüyor.

## 4. Görev profilleri

**Neden (Kural 16 ve 17):** Her oyun hava ve başlangıç değerleri bakımından birebir aynıydı.

**Önce ölçtüklerim (objektif sonuç):**
- Yalnızca toz günlerinin *sırasını* rastgele yapmak **hiçbir** yolun sonucunu değiştirmiyor (363 yolun 0'ı), çünkü toplam enerji aynı kalıyor. Bu yüzden bu fikir elendi.
- Bu tasarımda oyunu asıl sıkıştıran şey **oksijen**. Enerji ise görece bol. Bu yüzden profiller, toplam tozu *ve* oksijeni değiştiriyor.

| Profil | Toz (geçişler) | Başlangıç E/O/S | Başarı / Kısmi / Durma |
|---|---|---|---|
| `standard` | 2, 4 | 8/8/8 | 103 / 219 / 41 |
| `dusty-season` | 2, 3, 4 | 8/8/8 | 95 / 214 / 51 |
| `small-oxygen-supply` | 2 | 8/7/8 | 77 / 199 / 45 |

- Oyun başında bir profil rastgele seçilir ve brifingi Sahne 1'den önce gösterilir. Oyuncu böylece plan yapabilir (Kural 16: "önceden hazırlık").
- **Her profilde 17 seçeneğin hepsi en az bir başarılı yolda kullanılabiliyor**, en yüksek bilim 8. Yani tek bir doğru strateji yok ve hiçbir profil kazanılamaz değil. Test aracı bunu otomatik kontrol ediyor.
- Sahne 2'nin hikâyesi bir güç sıkıntısını anlatıyor. Bu yüzden her profilde Sahne 2'den sonra toz var, test bunu da zorunlu tutuyor.
- Panel bakımı (1A) artık "her tozlu geçişte +1" veriyor. Tozlu sezonda 3 kez işe yaradığı için daha değerli. Profil, 1A ile 1B arasındaki tercihi gerçekten etkiliyor.

**Teknik değişiklik:** Sahne geçişlerindeki sabit `effects` ve `variants` alanları kaldırıldı. Değerler artık `MISSION.recharge`, `MISSION.lifeSupport` ve profilden hesaplanıyor. `transition` alanında yalnızca isteğe bağlı bir `note` kaldı. `docs/story-data-contract.md` içinde 8. adım buna göre güncellendi.

## 5. Gelecek ekip raporu (yiyecek)

**Neden (Kural 9):** Kural "yetersiz üretim uzun vadeli görev başarısını etkilemeli" diyor. v1.1'de serayı kapatmanın tek bedeli bilim puanıydı.

**Ne değişti:** Her bitiş ekranında *"Is the base ready for the next crew?"* raporu çıkıyor:
- **Fresh food:** sera tam → hazır, az → sınırlı, kapalı → risk altında.
- **Crew health margin:** Güvenlik 6 veya üstü → iyi, altı → düşük.

Bu rapor kazanma/kaybetme sonucunu **değiştirmiyor**. Story plan'daki "sera zafer koşulu değildir" kararı korunuyor. Ama seranın uzun vadeli sonucu artık açıkça görünüyor.

## 6. Test aracı

`tools/check_story_data.mjs` (arkadaşımızın yazdığı bağımsız referans model) güncellendi:
- Geçişler artık kurallardan hesaplanıyor (`transitionEffects`).
- 3 profilin her biri ayrı ayrı test ediliyor: beklenen sayılar, en yüksek bilim 8, her seçenek kazanılabilir.
- Profil yapısı, `nextCrewReport` ve kurallar için ek kontroller var.
- 5 örnek yol (standart profil) aynı değerlerle geçiyor.

**Bağımsız doğrulama:** Sayıları ayrıca ayrı yazılmış bir modelle de hesapladım. Üç profilde de aynı sonuç çıktı.

Çalıştırmak için:

```sh
node tools/check_story_data.mjs
```

## Yapılmayanlar / açık konular

- **Türkçe dil seçeneği:** Metinler hâlâ doğrudan İngilizce. Arayüzden önce metinleri dil dosyalarına ayırmak gerekiyor.
- **Uzun metinler:** Bazı DUTİ konuşmaları (örneğin Sahne 3) 7–12 yaş için uzun. Kısaltmayı sen yapmak ister misin?
- **Karar motoru (`makeDecision`) ve arayüz:** Henüz yok. Bir sonraki adım bunlar.
- **Görseller:** Seçilmedi. Mars fotoğrafları için Mars Trek / NASA görselleri ve telif bilgisi gerekiyor.
