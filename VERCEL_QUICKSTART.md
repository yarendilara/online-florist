# 🌸 Online Florist - Hızlı Başlangıç (Vercel + Supabase)

## TLDR - 5 dakikada kurulum

### 1️⃣ Supabase Veritabanı Kur
1. [supabase.com](https://supabase.com) adresine git
2. Hesap oluştur
3. **New Project** tıkla
4. Proje adı: `online-florist`
5. Password: Güvenli bir şifre belirle
6. **Settings → Database → Connection string** kopyala (PostgreSQL tab)

### 2️⃣ Environment Variables Ayarla

**Local (test için):**
```bash
# setup-db.js çalıştır ve prompta Supabase connection string'i gir
node setup-db.js
```

Veya manuel `.env` dosyası oluştur:
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.XXXXX.supabase.co:5432/postgres
SESSION_SECRET=your_super_secret_key_min_32_chars
NODE_ENV=production
```

### 3️⃣ Sunucuyu Başlat
```bash
npm install
npm start
```

Admin girişi:
- **Email:** `admin@florist.com`
- **Password:** `admin123`

### 4️⃣ Vercel'e Deploy

**Vercel Dashboard:**
1. Project settings → Environment Variables
2. Ekle:
   - `DATABASE_URL`: Supabase connection string
   - `SESSION_SECRET`: Güvenli secret key
3. Deploy et

```bash
vercel deploy --prod
```

---

## Vercel'de Çalıştığından Emin Ol

1. [your-project].vercel.app adresine git
2. Admin panele git: `/admin`
3. Login: `admin@florist.com` / `admin123`

### Sorun mu?
```bash
# Vercel logs bak
vercel logs --tail

# Local test et
DATABASE_URL=postgresql://... npm start
```

---

## Kategoriler ve Ürün Ekle

**Supabase SQL Editor'da:**

```sql
-- Kategoriler
INSERT INTO categories (name, description) VALUES 
('Buquets', 'Çiçek buketi koleksiyonu'),
('Arrangements', 'Özel tasarım düzenlemeler'),
('Dried Flowers', 'Kurutulmuş çiçekler'),
('Plants', 'Canlı bitkiler');

-- Ürünler
INSERT INTO products (name, description, price, stock_quantity, category_id, image_path) VALUES 
('Red Rose Bouquet', 'Beautiful red roses', 45.99, 10, 1, '/images/rose.jpg'),
('Sunflower Mix', 'Mixed sunflowers', 35.50, 15, 1, '/images/sunflower.jpg'),
('Tulip Arrangement', 'Elegant tulip display', 55.00, 8, 2, '/images/tulip.jpg');
```

---

## Production İçin

### 1. Admin Şifresini Değiştir
Supabase'de `users` tablosunda `admin@florist.com` şifresini güncelle.

### 2. SESSION_SECRET Değiştir
`.env` dosyasında rastgele bir secret key kullan:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. NODE_ENV=production Ayarla
```
NODE_ENV=production
```

---

## Teknik Detaylar

**Database:** PostgreSQL (Supabase)
**Hosting:** Vercel (Serverless)
**Session:** Express-session + PostgreSQL
**Auth:** bcryptjs (password hashing)

**Vercel Limits:**
- Max function duration: 300 saniye
- Memory: 1024MB
- Cold start: ~5-10 saniye

---

## Sorular?

1. Loglara bak: `vercel logs --tail`
2. Supabase dashboard kontrol et
3. .env dosyası yazılı mı?
4. DATABASE_URL doğru mu?

---

**Hazır mısın? Başla:** `npm start` 🚀
