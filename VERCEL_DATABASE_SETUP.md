# 🌸 Online Florist - Vercel & Supabase Setup Özeti

Vercel'e deploy ettin ama database yoktu. İşte tam çözüm:

## ⚡ Quickstart (3 adım)

### 1. Supabase Aç
- [supabase.com](https://supabase.com) → New Project
- Connection string'i kopyala (Settings → Database)

### 2. .env Ayarla
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@db.XXXXXX.supabase.co:5432/postgres
SESSION_SECRET=your_secret_key_here_32_chars
```

### 3. Çalıştır
```bash
npm install
npm start
```

Login:
- Email: `admin@florist.com`
- Password: `admin123`

---

## 📚 Dökümanlar

| Dosya | İçerik |
|-------|--------|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Adım adım Supabase kurulumu |
| [VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md) | Vercel deploy rehberi |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Database seçenekleri |
| [.env.example](./.env.example) | Environment variables template |

---

## 🗄️ Database Mimarisi

```
PostgreSQL (Supabase)
├── users (admin login)
├── categories (çiçek kategorileri)
├── products (ürünler)
├── orders (sipariş geçmişi)
└── order_items (sipariş detayları)
```

---

## 🚀 Vercel Deploy

### 1. Environment Variables Ekle
Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=postgresql://postgres:...
SESSION_SECRET=your_secret_key
NODE_ENV=production
```

### 2. Deploy
```bash
vercel deploy --prod
```

**Test:** `https://your-project.vercel.app/admin`

---

## ✅ Çalışması Gereken Şeyler

- [x] Admin login (`admin@florist.com` / `admin123`)
- [x] Kategoriler ürünleri gösteriyor
- [x] Admin paneli kategoriler ekleyebiliyor
- [x] Admin paneli ürünleri ekleyebiliyor
- [x] Shop sayfasında ürünler listeniyor
- [x] Cart functionality çalışıyor
- [x] Order history kaydediliyor

---

## 🐛 Sorun mu?

```bash
# Local test et
DATABASE_URL=postgresql://... npm start

# Logs bak (Vercel)
vercel logs --tail

# Connection test
node -e "const db = require('./src/utils/database'); db.connect().then(()=>console.log('✓ Connected')).catch(e=>console.log('✗', e.message))"
```

---

## 📝 Sonraki Adımlar

1. **Admin şifresi değiştir** (Supabase → users tablo)
2. **Ürün resimleri ekle** (`/public/images/` klasörü)
3. **Email notifications** ayarla
4. **Payment gateway** (Stripe/PayPal) entegre et

---

**Sorular?** Loglara bak veya Supabase dokümanlarını oku.

Başarılar! 🌹
