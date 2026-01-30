# 🔧 Supabase Setup Adımları

## 1. Proje Oluştur

### Supabase'de:
```
1. supabase.com → Sign Up
2. New Project
   - Project name: online-florist
   - Database Password: [güvenli şifre]
   - Region: Europe (Coppenhagen) ← EN YAKIN
```

**Bekleme:** ~2-3 dakika

## 2. Connection String Al

### Dashboard'da:
```
1. Settings (sol sidebar)
2. Database (tab)
3. Connection string (section)
4. PostgreSQL seç (default)
5. Copy tuşu tıkla
```

**Çıktı şöyle görünür:**
```
postgresql://postgres:YOUR_PASSWORD@db.XXXXXXXXXXXXX.supabase.co:5432/postgres
```

## 3. .env Dosyasını Güncelle

Proje root'unda `.env` oluştur:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.XXXXXXXXXXXXX.supabase.co:5432/postgres
SESSION_SECRET=your_super_secret_key_here_must_be_32_chars_or_more_to_be_secure
NODE_ENV=production
PORT=3000
```

## 4. Sunucuyu Başlat

```bash
npm install
npm start
```

Çıktı:
```
🔌 Creating new PostgreSQL pool...
✅ Connected to PostgreSQL (Supabase)
✓ Veritabanı tabloları oluşturuldu/kontrol edildi
✓ Default admin user created
  Email: admin@florist.com
  Password: admin123
✓ Server çalışıyor: http://localhost:3000
✓ Admin paneli: http://localhost:3000/admin
```

## 5. Admin Girişini Test Et

Browser'da:
```
http://localhost:3000/admin
```

Login:
```
Email: admin@florist.com
Password: admin123
```

## 6. Veritabanına Veri Ekle

### Supabase SQL Editor'da:

**Categories:**
```sql
INSERT INTO categories (name, description) VALUES 
('Buquets', 'Çiçek buketi koleksiyonu'),
('Arrangements', 'Özel tasarım düzenlemeler'),
('Dried Flowers', 'Kurutulmuş çiçekler'),
('Plants', 'Canlı bitkiler');
```

**Products:**
```sql
INSERT INTO products (name, description, price, stock_quantity, category_id, image_path) 
VALUES 
('Red Rose Bouquet', 'Güzel kırmızı güller', 45.99, 10, 1, '/images/rose.jpg'),
('Sunflower Mix', 'Karışık ayçiçekleri', 35.50, 15, 1, '/images/sunflower.jpg'),
('Tulip Arrangement', 'Zarif lale düzenlemesi', 55.00, 8, 2, '/images/tulip.jpg'),
('Dried Pampas', 'Kurutulmuş pampas çiçekleri', 25.00, 20, 3, '/images/pampas.jpg'),
('Monstera Plant', 'Canlı Monstera bitkisi', 65.00, 5, 4, '/images/monstera.jpg');
```

## 7. Admin Şifresini Değiştir (Production)

**Supabase'de:**

1. Table Editor → users
2. admin@florist.com satırı → Edit
3. `password` alanını tıkla
4. Yeni hash'i yapıştır

**Hash Oluştur:**
```bash
node -e "
const bcrypt = require('bcryptjs');
const password = 'YENİ_GÜVENLI_ŞİFRE_BURAYA';
bcrypt.hash(password, 10, (err, hash) => {
  console.log(hash);
});
"
```

Çıkan hash'i kopyala ve Supabase'e yapıştır.

## 8. Vercel'e Deploy

### Step 1: Vercel Connected
```bash
vercel link
```

### Step 2: Environment Variables
Vercel dashboard'ta → Settings → Environment Variables:
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.XXXXXXXXXXXXX.supabase.co:5432/postgres
SESSION_SECRET=your_random_secret_key_here
NODE_ENV=production
```

### Step 3: Deploy
```bash
vercel deploy --prod
```

**Test:**
```
https://your-project-name.vercel.app/admin
```

## 🐛 Troubleshooting

### "ECONNREFUSED"
```
❌ PostgreSQL bağlanamıyor

✓ Çözüm:
- DATABASE_URL doğru mu? (connection string kopyala)
- Supabase project aktif mı? (dashboard kontrol)
- Locale test et: DATABASE_URL=... npm start
```

### "Admin login çalışmıyor"
```
❌ Admin kullanıcısı yok

✓ Çözüm:
1. Supabase → Table Editor → users
2. Satır ekle: username=admin, email=admin@florist.com
3. password = bcrypt hash (yukarı bak)
4. is_admin = true
```

### "500 error on Vercel"
```
❌ SERVER ERROR

✓ Çözüm:
1. Logs bak: vercel logs --tail
2. Environment variables set mi?
3. DATABASE_URL geçerli mi?
4. Supabase project running mi?
```

### "Cannot find module 'pg'"
```bash
npm install pg
vercel deploy --prod
```

## 📊 Verilerine Bak

**Supabase'de:**
- Table Editor → users/products/categories
- SQL Editor → Custom queries
- Realtime → Live events

## 🔐 Production Checklist

- [ ] Admin şifresi değiştirildi mi?
- [ ] SESSION_SECRET güvenli mi?
- [ ] NODE_ENV=production ayarlandı mı?
- [ ] DATABASE_URL Supabase'den alındı mı?
- [ ] CORS ayarları doğru mu?
- [ ] Vercel logs temiz mi?

---

**Başarılı kurulum sonrası:**
```
✓ Admin giriş çalışıyor
✓ Kategoriler ürünler görünüyor
✓ Shop sayfasında veri gösteriliyor
✓ Order yapabiliyorsun
```

Tamamlandı! 🎉
