# Dağıtım ve Yönetim Notları

## Mimari

- **Uygulama:** Next.js 14 (App Router), Vercel'de veya herhangi bir Node.js
  sunucusunda (`next start`) çalışır.
- **Veritabanı + Auth + Depolama:** Supabase (Postgres, ücretsiz plan).
  Proje: `vesta-house` (`sckrhchgmcqugpipoaij`).
- **Menü verisi artık statik JSON değil, canlı veritabanı sorgusudur.**
  `/menu` sayfası her istekte `/menu/api/[lang]` route'u üzerinden Supabase'e
  bağlanır (`force-dynamic`, önbelleksiz). Yönetim panelinden yapılan her
  değişiklik, sitede **yeniden derleme/deploy gerekmeden** anında görünür.
- QR kodları `/menu` adresine işaret eder; bu route hiç değişmedi, sadece
  arkasındaki veri kaynağı değişti. **Mevcut QR kodlarınız çalışmaya devam
  eder.**

## Ortam değişkenleri

`.env.local` (yerelde) veya barındırma sağlayıcınızın "Environment Variables"
ekranında (üretimde) şunlar tanımlı olmalı:

| Değişken | Nerede kullanılır | Not |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Uygulama (tarayıcı + sunucu) | Public, güvenli |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Uygulama (tarayıcı + sunucu) | Public, güvenli (RLS ile korunur) |
| `SUPABASE_URL` | Yalnızca `scripts/*.js` | Sunucu betikleri için |
| `SUPABASE_SERVICE_ROLE_KEY` | Yalnızca `scripts/*.js` | **Gizli.** RLS'i bypass eder; asla `NEXT_PUBLIC_` yapmayın, asla deploy ortamına koymayın — yalnızca yerel makinenizde, tek seferlik betikleri çalıştırırken kullanılır. |

`.env.local` `.gitignore` içinde — repoya asla commit edilmez.

## Veritabanı kurulumu (yeni bir Supabase projesine taşınırsa)

```bash
supabase link --project-ref <yeni-proje-ref>
supabase db query --linked --file supabase/migrations/0001_menu_schema.sql
npm run seed:menu        # mevcut public/menu/data/*.json içeriğini aktarır
npm run create:admin     # varsayılan admin hesabını oluşturur
```

`seed:menu` yalnızca tablo boşsa çalışır (tekrar çalıştırmak veri
tekrarlamaz, sessizce atlar).

## Vercel'e deploy

1. GitHub reposunu Vercel'e bağlayın (veya `vercel` CLI ile deploy edin).
2. Vercel proje ayarlarında yukarıdaki iki `NEXT_PUBLIC_*` değişkenini girin
   (service role key'i **buraya girmeyin** — uygulama çalışırken hiç
   gerekmiyor).
3. Deploy edin. Build sırasında veritabanına ihtiyaç yoktur (`/admin` ve
   `/menu/api` route'ları `force-dynamic` olduğundan derleme zamanında
   çalıştırılmaz).
4. Supabase projesinin "Site URL" / redirect ayarlarına production
   domain'inizi ekleyin (Authentication → URL Configuration).

Barındırma için Vercel'in ücretsiz (Hobby) planı yeterlidir; Next.js App
Router, Server Actions ve Route Handler'ları native destekler.

## Admin paneli

- **Adres:** `https://<domain>/admin`
- **Varsayılan hesap:** `npm run create:admin` çalıştırıldığında oluşturuldu
  (e-posta/şifre çalıştıran kişiye konsoldan gösterildi).
- **Şifre değiştirme:** Giriş yaptıktan sonra sol menüden **Ayarlar** →
  mevcut şifre + yeni şifre (en az 8 karakter) girip **Şifreyi Güncelle**.
- Yeni bir yönetici eklemek isterseniz: `node scripts/create-admin.js
  yeni@eposta.com "GucluBirSifre123"`.

## Yedekleme

Supabase Dashboard → Database → Backups üzerinden otomatik günlük yedekler
ücretsiz planda 7 gün saklanır. Kritik değişiklik öncesi manuel yedek almak
isterseniz: `supabase db dump --linked -f backup.sql`.
