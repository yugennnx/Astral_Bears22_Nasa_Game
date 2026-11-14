> **ARŞİV (geçersiz kural seti).** Bu 10 sollu taslak, 6 sahnelik `story-plan.md` seçildiği için arşivlendi. Oyunun geçerli kuralları `story-plan.md` ve `src/game/scenes.js` içindedir. Bu belge yalnızca tasarım geçmişi ve NASA veri araştırması (DONKI, MEDA) için saklanıyor; gerçek veri dosyaları hâlâ `data/` klasöründe ve oyunda kullanılıyor.

# Red Base: 10 Sols — Oyun Tasarım Belgesi

Format: Hikâye ve karar tabanlı oyun (Narrative Decision Tree) + arka planda küçük bir kaynak simülasyonu
Ortam: **Mars** (kesin) · Hedef yaş: 7–12 · Dil: İngilizce başlar, Türkçe seçilebilir
Görsel stil: Çizgi film karakterler + gerçek NASA Mars fotoğrafları

> **Etiket kuralı:** Bu belgedeki bütün sayılar **oyun varsayımıdır** (🎲). Gerçek NASA verisi yalnızca **🛰️** işaretli yerlerde geçer ve kaynağı `data/nasa_events.json` dosyasındadır. Bu iki tür bilgi oyunda da ayrı gösterilir.

---

## 1. Kaynaklar (hepsi 0–10 ölçeğinde 🎲)

Ekranda her kaynak **10 parçalı bir çubuk** olarak görünür. Çocuk sayı hesaplamaz, dolu kutu sayar.

| Kaynak | Simge | Çocuğa açıklama | Başlangıç | Neyle bağlantılı |
|---|---|---|---|---|
| **Enerji** (Power) | ⚡ | "Bataryalarımız. Güneş panelleri doldurur, makineler harcar." | 6 | Güneş ışığı ve toz üretimi belirler. Yaşam desteği ve sera her sol enerji harcar. |
| **Oksijen** (Oxygen) | 🫧 | "Nefes aldığımız hava. Makinemiz enerjiyle oksijen yapar." | 7 | Yaşam desteği enerji alamazsa oksijen düşer. |
| **Yiyecek** (Food) | 🥕 | "Kargodaki yemek ve seradaki bitkiler." | 6 | Sera enerji harcar ama ürünü 3 sol sonra verir. |
| **Güvenlik** (Safety) | 🛡️ | "Astronotların sağlığı ve korunması." | 7 | Radyasyon, dış görevler, açlık ve arızalar düşürür. Bakım ve dinlenme artırır. |
| **Bilim Puanı** (Science) | 🔬 | "Mars'ta keşfettiklerimiz." | 0 | Hayatta kalmak için gerekmez ama görev başarısı için gerekir. |

**Renk ve simge birlikte:** 7–10 yeşil ✅, 4–6 sarı ⚠️, 1–3 kırmızı 🚨. Renk tek başına bilgi taşımaz.

**Not:** Dördüncü kaynak olarak Yiyecek'i ekledik. Planda "üç temel kaynak" yazıyordu, bu bilinçli bir değişiklik.

---

## 2. Her sol otomatik olanlar (🎲)

Her sol önce güneş enerji üretir, sonra oyuncu karar verir, sonra üs kendi tüketimini yapar.

| Adım | Kural |
|---|---|
| ☀️ Güneş üretimi | Açık hava **+4**, tozlu hava **+2**, toz fırtınası **+1** enerji |
| 🫧 Yaşam desteği, normal mod | **−2 enerji**. Oksijen üretilen kadar tüketilir (net 0). |
| 🫧 Yaşam desteği, tasarruf modu | **−1 enerji**, ama oksijen **−1** |
| ⚠️ Enerji yetmezse | Yaşam desteği durur ve oksijen **−2** olur. *Bu, "bugün tasarruf → yarın oksijen sıkıntısı" zincirinin kalbidir.* |
| 🌱 Sera (kurulduysa) | **−1 enerji / sol**. Kurulduktan **3 sol sonra** her sol **+1 yiyecek** verir. |
| 🍽️ Mürettebat yemeği | **−1 yiyecek / sol** |
| 😟 Yiyecek bittiyse | Yiyecek 0 iken her sol **−1 güvenlik** (açlık hemen öldürmez ama sağlığı bozar) |
| 🔧 Oksijen makinesi arızalıysa | Onarılana kadar her sol **−2 oksijen** |

Değerler 0'ın altına ve 10'un üstüne çıkmaz. Enerjisi yetmeyen seçenek gri görünür: "Not enough power".

---

## 3. Kazanma ve kaybetme (🎲)

| Sonuç | Koşul | Ekranda |
|---|---|---|
| 🚨 **Görev başarısız** | Oksijen **0** olursa | "The base ran out of air on Sol X." + hangi karar zincirinin buna yol açtığı |
| 🚨 **Görev başarısız** | Güvenlik **0** olursa | "The crew had to be evacuated on Sol X." + nedenleri |
| 🟡 **Kısmi başarı** | 10 sol hayatta kaldı, Bilim **< 6** | "Everyone is safe, but the science goal was missed." |
| ✅ **Görev başarılı** | 10 sol hayatta kaldı, Bilim **≥ 6** | Hangi kararların işe yaradığı listesi |
| 🌟 **Yıldız Kaşif** | 10 sol hayatta kaldı, Bilim **≥ 9** | Özel rozet |

Enerjinin 0 olması tek başına kayıp değildir. Ama yaşam desteğini durdurduğu için dolaylı olarak oksijeni bitirir.

---

## 4. Sol sol karar tablosu (🎲)

Her solda 3 seçenek vardır. 🔬L işareti, **Laboratuvar** kurulduysa o seçeneğin **+1 ek bilim** verdiğini gösterir (yalnızca üs içi araştırmalarda geçerli).

| Sol | Hava | Sahne | A | B | C |
|---|---|---|---|---|---|
| 1 | Açık | **Varış.** İlk yatırımını seç. | 🌱 Sera kur: ⚡−2. Sol 4'ten itibaren yiyecek üretir. | 🔬 Laboratuvar kur: ⚡−1, 🔬+1. İç araştırmalara +1. | 🤖 Panel temizleme robotu: ⚡−1. Tozlu havada +2, fırtınada +1 enerji. |
| 2 | Açık | **İlk keşif.** | 🚶 Yürüyerek dış görev: ⚡−1 🫧−1 🛡️−1 🔬+2 | 🚙 Rover ile uzaktan: ⚡−2 🔬+1 (🔬L) | 🔧 Üs bakımı: 🛡️+1 |
| 3 | Tozlu | **Toz bulutu yaklaşıyor** (🛰️ MEDA bilgi kartı) | 🔋 Aletleri kapat, enerji biriktir: ⚡+1 | 🔬 Araştırmaya devam: ⚡−1 🔬+1 (🔬L) | 📡 **Dünya'ya sor**: ⚡−1. Cevap Sol 4'te gelir: panel açısı ayarı, Sol 4–5'te +1 enerji. |
| 3+ | | *Sera kurulmadıysa* 4. seçenek | 🌱 Geç sera: ⚡−2. Ürün Sol 6'dan itibaren. | | |
| 4 | **Fırtına** | **Toz fırtınası.** Güneş zayıf. | Yaşam desteği normal modda kalsın | 💤 Tasarruf modu (Sol 4–5): her sol ⚡+1 tasarruf ama 🫧−1 | Sera varsa: serayı 1 sol dinlendir (bakım yok, hasat 1 sol gecikir). Yoksa: ısıtıcıları kıs, ⚡+1 🛡️−1. |
| 5 | Tozlu | **☀️ Güneş fırtınası uyarısı** (🛰️ DONKI). Parçacık bulutu Sol 7'de geliyor. | 📡 **Dünya'ya sor**: ⚡−1. Cevap Sol 6'da: kalkan yarı maliyetle kurulur. | 🛡️ Hemen kalkan kur: ⚡−2 | 🚶 Göreve devam: ⚡−1 🫧−1 🔬+2 (hazırlık yok) |
| 6 | Açık | **Hazırlık günü.** | 🛡️ Kalkan kur (henüz yoksa): ⚡−2, Dünya'ya sorduysan ⚡−1 | 🔬 Örnek analizi: ⚡−1 🔬+1 (🔬L) | 😴 Dinlen: 🛡️+1 |
| 7 | Açık | **Fırtına günü.** | 🏠 Sığınakta kal: kalkan varsa 🛡️ 0, yoksa 🛡️−2. O gün bilim yok. | 🛰️ Dışarıda eşsiz ölçüm: ⚡−1 🫧−1 🛡️−3 🔬+3 | 🧪 İçeride çalış: ⚡−1 🔬+1 (🔬L). Kalkan varsa 🛡️−1, yoksa 🛡️−3. |
| 8 | Açık | **🔧 Oksijen makinesi arızalandı!** | Hemen onar: ⚡−2 | 📡 **Dünya'ya sor**: ⚡−1 🫧−2. Uzaktan onarım Sol 9'da (⚡−1). | Ertele, araştırmaya devam: ⚡−1 🔬+2. Onarılana kadar her sol 🫧−2. |
| 9 | Açık | **Büyük keşif fırsatı: uzak krater.** | 🚙 Uzak krater: ⚡−2 🫧−1 🛡️−1 🔬+3 | 🪨 Yakın örnek: ⚡−1 🔬+1 (🔬L) | 😴 Dinlen: 🛡️+1 ⚡+1. *(Arıza sürüyorsa 4. seçenek: şimdi onar ⚡−2)* |
| 10 | Açık | **Son gün: verileri Dünya'ya gönder.** | 📡 Tam veri: ⚡−2 🔬+2 | 📨 Özet veri: ⚡−1 🔬+1 | 🔒 Üssü güvenle kapat: 🛡️+1 |

**Kural 8'e uygunluk:** Kalkan **bir kez kurulur** (enerji ve zaman harcar). Kurulduktan sonra sürekli elektrik tüketmez. Sığınakta kalmanın bedeli, o gün bilim yapamamaktır.

---

## 5. Sonuç zincirleri (kararların gecikmeli etkisi)

Danışman karakter, zincir tamamlandığında çocuğa "bunu hatırlıyor musun?" kartı gösterir.

| Erken karar | Ne zaman ortaya çıkar | Sonuç |
|---|---|---|
| Sol 1'de sera kurmak | Sol 4 → Sol 10 | Yiyecek hiç bitmez. Ama her sol 1 enerji gider, fırtınada sıkışırsın. |
| Sol 1'de sera kurmamak | Sol 6–7 | Kargo yemeği biter, her sol güvenlik düşer. |
| Sol 1'de laboratuvar | Sol 2, 3, 6, 7, 9 | Her iç araştırma +1 bilim verir. Yıldız rozetine en kısa yol, ama yiyecek ve güvenlik riskli. |
| Sol 1'de robot | Tozlu sollar | Tozlu havada enerji neredeyse açık hava kadar. Rastgele havalı oyunlarda daha değerli olur. |
| Sol 3'te Dünya'ya sormak | Sol 4–5 | Panel ayarı fırtınayı hafifletir. Bedeli o gün araştırma yapamamak. |
| Sol 4'te tasarruf modu | Sol 4–5 | Enerji kurtarır ama oksijen 2 düşer. Sol 8 arızasında oksijen az olursa tehlikeli. |
| Sol 5'te hazırlık yapmamak | Sol 7 | Kalkan yoksa sığınakta bile güvenlik düşer. |
| Sol 5'te Dünya'ya sormak | Sol 6 | Cevap 1 sol sonra gelir, kalkan ucuzlar. Ama bir sol kaybettin. |
| Sol 8'de arızayı ertelemek | Sol 8–10 | Her sol −2 oksijen. Oksijen düşükse görev kaybedilir. |

**"Dünya'ya sor" kuralı:** Mars ile Dünya arasında bir mesajın tek yönde gitmesi yaklaşık **3–22 dakika** sürer (🛰️ gerçek aralık; gezegenlerin konumuna göre değişir). Soru, Dünya'daki ekibin incelemesi ve cevap birleşince oyunda bu, **1 sol gecikme** olarak basitleştirilmiştir (🎲). Sormak her zaman en iyi yol değildir: "her şeyi sor" stratejisi testte yalnızca kısmi başarı aldı.

---

## 6. Gerçek NASA verisi nerede kullanılıyor (🛰️)

| Oyunda nerede | Veri | Kaynak | Nasıl kullanılıyor |
|---|---|---|---|
| Sol 5 uyarısı, Sol 7 fırtınası | **DONKI CME 2024-05-20T05:36:00-CME-001.** Başlangıç 20 Mayıs 2024 05:36 UTC. Hız 1927–2678 km/s. Halo CME, kaynağı Güneş'in Dünya'dan görünmeyen arka yüzü. | [DONKI kaydı](https://ccmc.gsfc.nasa.gov/DONKI/view/CME/31034/-1), [DONKI uyarısı 20240520-AL-001](https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/31039/1) | Sahnenin hikâyesi ve bilgi kartı. Güvenlik kaybı sayıları **🎲 oyun varsayımıdır**, ölçüm değil. |
| Sol 7 sonrası bilgi kartı | 20 Mayıs 2024 olayında **Curiosity RAD**, rover'ın yanındaki bir astronotun **8.100 mikrogray** alacağını hesapladı (NASA'ya göre 30 göğüs röntgeni, ölümcül değil). | [NASA, 10 Haziran 2024](https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasa-watches-mars-light-up-during-epic-solar-storm/) | "Gerçek hayatta ne oldu?" kartı. Oyunda doz hesabı yapılmaz. |
| Sol 3 toz sahnesi | Perseverance **MEDA** hava sıcaklığı, Jezero Krateri. Sol 290 (13 Aralık 2021): en düşük −76,9 °C, en yüksek −3,1 °C. Sol 313 ve 330 da dosyada. | [PDS MEDA arşivi](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/PERSEVERANCE/meda.html), özet `data/meda_jezero.json` | Bilgi kartı: "Bir solda 70 dereceden fazla fark!" Isıtıcı ve gece bataryası ihtiyacını açıklar. Toz-enerji sayıları **🎲 oyun varsayımı** (RDS ışık kanalları henüz doğrulanmadı). |
| Arka planlar | Gerçek Mars yüzey fotoğrafları / **Mars Trek** | trek.nasa.gov/mars | Görsel, kaynak altyazılı |

**Dürüstlük notları (jüriye ve oyunda gösterilecek):**
- DONKI, Mars yüzeyindeki doz ölçümü değildir. Bu kayıt Güneş'ten çıkan CME'yi tanımlar.
- DONKI uyarısı bu CME'nin **Juno ve Solar Orbiter** araçlarına ulaşacağını tahmin ediyordu, Mars'tan bahsetmiyor. Bu CME'nin NASA makalesindeki Mars olayıyla aynı olay olduğu **bizim yorumumuz**dur (aynı gün, aynı arka yüz kaynağı).
- 20 Mayıs için DONKI'de bir güneş patlaması (FLR) kaydı **yok**. Patlama Dünya'dan görünmeyen tarafta olduğu için bu beklenen bir durum. NASA makalesindeki X12 sınıfı tahmin, Solar Orbiter verisine dayanıyor.
- Gerçekte parçacıkların bir kısmı Mars'a dakikalar içinde ulaştı. Oyundaki "2 sol önceden uyarı" bir basitleştirmedir (🎲).

**Challenge'ın önerdiği diğer kaynaklar** (sonraki adımlar için): NASA Open APIs (api.nasa.gov), OSDR (bitki ve astronot sağlığı kartları), **RadLab** (ISS'teki gerçek doz ölçümleri; "uzay istasyonu ile Mars karşılaştırması" kartı için), Kanada Uzay Ajansı'nın uzayda yiyecek üretimi seti.

---

## 7. Denge testi sonuçları

`tools/balance_sim.py` bütün karar kombinasyonlarını (yaklaşık 80.000 oyun) dener. Son ayarla:

| Strateji | Sonuç |
|---|---|
| Hep güvenli oyna | 🟡 Kısmi başarı (bilim 1) |
| Açgözlü bilim (her riski al) | 🚨 Sol 9'da oksijen biter |
| Hep Dünya'ya sor | 🟡 Kısmi başarı (bilim 4) |
| Dengeli + laboratuvar | ✅ Başarılı (bilim 8) |
| Dengeli + robot | ✅ Başarılı (bilim 8) |

| Sol 1 seçimi | Kazanma | Yıldız | Kayıp | Karakter |
|---|---|---|---|---|
| Sera | %41 | %10 | %31 | Güvenli, yavaş bilim |
| Laboratuvar | %43 | %21 | %49 | Yüksek ödül, yüksek risk |
| Robot | %24 | %3 | %48 | Sabit havada zayıf, tozlu havada güçlenir |

Tek bir "her zaman doğru" yol yok. Güvenli oyun bilimi kaçırır, açgözlü oyun üssü kaybeder.

**Bilinen açık:** Robot, sabit hava sırasında en zayıf seçenek. Rastgele hava (aşağıda) eklenince tekrar test edilecek.

---

## 8. Tekrar oynanabilirlik (sonraki sürüm)

- Başlangıç değerleri ±1 rastgele.
- Sol 2–9 arası hava (açık / tozlu) rastgele. Sol 4 fırtınası ve Sol 5–7 güneş olayı sabit kalır.
- Arıza Sol 6 veya Sol 8'de gelebilir.
- Zorluk: Explorer (başlangıç +1), Commander (normal).
