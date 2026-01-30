# Database Setup - Online Florist

Vercel'de çalıştırmak için PostgreSQL veritabanı gerekiyor. İşte adımlar:

## 1. Supabase ile PostgreSQL Kur (ÖNERİLİ)

### Adım 1: Supabase Projesi Oluştur
1. [supabase.com](https://supabase.com) adresine git
2. Hesap oluştur ve giriş yap
3. **"New Project"** tıkla
4. Proje adı: `online-florist`
5. Region seç (ör: Europe)
6. Database password: Güvenli bir şifre belirle
7. Projesi oluşturulmasını bekle (~2 dakika)

### Adım 2: Connection String Al
1. Supabase dashboard'a git
2. Sol sidebar'da **"Settings"** → **"Database"** tıkla
3. **"Connection string"** bölümüne git
4. **"PostgreSQL"** tab'ını seç
5. Connection string'i kopyala (şöyle görünür):
```
postgresql://postgres:YOUR_PASSWORD@db.RANDOM_ID.supabase.co:5432/postgres
```

### Adım 3: .env Dosyasını Güncelle
Proje kök dizininde `.env` dosyasını oluştur/güncelle:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.RANDOM_ID.supabase.co:5432/postgres
SESSION_SECRET=your_super_secret_key_here_at_least_32_chars_long
NODE_ENV=production
```

## 2. Local Geliştirme (SQLite ile Test)

Eğer çalıştırmak için DATABASE_URL ayarlanmazsa, code otomatik SQLite kullanacak:
```bash
npm start
```

## 3. Vercel'e Deploy

### Adım 1: Environment Variables Ekle
1. Vercel project dashboard'a git
2. **Settings** → **Environment Variables**
3. Şu değişkenleri ekle:
   - `DATABASE_URL`: Supabase connection string
   - `SESSION_SECRET`: Güvenli bir secret key

### Adım 2: Deploy Et
```bash
vercel deploy --prod
```

## 4. Admin Kullanıcı Oluştur

### Vercel'de:
1. Supabase dashboard'a git
2. **Table Editor** → **users** tablosunu aç
3. **Insert** → **Insert row** tıkla
4. Şu bilgileri gir:
   - username: `admin`
   - email: `admin@florist.com`
   - password: bcrypt hash (aşağıya bakın)
   - is_admin: `true`

### Password Hash Oluştur (Node.js):
```bash
node -e "
const bcrypt = require('bcryptjs');
const password = 'your_admin_password_here';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  else console.log(hash);
});
"
```

Çıkan hash'i `password` alanına kopyala.

## 5. Kategoriler ve Ürün Yükle

### Supabase'de Kategoriler Ekle:
```sql
INSERT INTO categories (name, description) VALUES 
('Buquets', 'Çiçek buketi koleksiyonu'),
('Arrangements', 'Özel tasarım düzenlemeler'),
('Dried Flowers', 'Kurutulmuş çiçekler'),
('Plants', 'Canlı bitkiler');
```

### Supabase'de Ürün Ekle:
```sql
INSERT INTO products (name, description, price, stock_quantity, category_id, image_path) VALUES 
('Red Rose Bouquet', 'Beautiful red roses', 45.99, 10, 1, '/images/rose-bouquet.jpg'),
('Sunflower Mix', 'Mixed sunflowers and greenery', 35.50, 15, 1, '/images/sunflower.jpg'),
('Tulip Arrangement', 'Elegant tulip display', 55.00, 8, 2, '/images/tulip-arrangement.jpg');
```

## 6. Test Et

Admin sayfasına git:
```
https://your-vercel-url.com/admin
```

Login:
- Email: `admin@florist.com`
- Password: Belirlediğin password

## Sorun Giderme

### "Cannot find module 'pg'"
```bash
npm install pg
```

### "Connection refused"
- DATABASE_URL doğru mu kontrol et
- Supabase'de database aktif mı?
- Firewall/IP whitelist kontrol et

### Admin login çalışmıyor
- Supabase'de user kaydı var mı?
- Password hash doğru mu?
- is_admin = true mi?

### Vercel'de 500 hatası
1. Vercel logs'u kontrol et: `vercel logs`
2. DATABASE_URL environment variable'ı ayarlandı mı?
3. Supabase project aktif mi?

## PostgreSQL Parametreleri

Vercel'de optimize edilmiş ayarlar:
- Max connections: 20
- Idle timeout: 30 saniye
- Connection timeout: 10 saniye
- SSL: Aktif (Supabase/Vercel otomatik sağlar)

---

**Sorular?** GitHub issues veya Vercel support'a başvur.
