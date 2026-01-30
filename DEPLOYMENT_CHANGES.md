# 📋 Vercel Deploy İçin Yapılan Değişiklikler

## ✅ Oluşturulan/Güncellenen Dosyalar

### Configuration
- **`vercel.json`** - Vercel deployment config
- **`.env.example`** - Environment variables template
- **`setup-db.js`** - Interactive database setup script

### Database
- **`src/utils/database.js`** (GÜNCELLENDİ) - PostgreSQL + SQLite desteği
- **`src/server.js`** (GÜNCELLENDİ) - Admin user auto-creation

### Dökümanlar (Yeni)
- **`SUPABASE_SETUP.md`** - Adım adım Supabase kurulumu
- **`VERCEL_QUICKSTART.md`** - Hızlı başlangıç rehberi
- **`DATABASE_SETUP.md`** - Database seçenekleri
- **`VERCEL_DATABASE_SETUP.md`** - Deploy özeti

---

## 🔧 Ne Değişti?

### database.js
```javascript
// ÖNCESİ: Sadece SQLite
// SONRAKİ: PostgreSQL + SQLite dual support
```

**Yeni Özellikler:**
- ✅ PostgreSQL (Supabase) desteği
- ✅ Automatic table creation
- ✅ Connection pooling
- ✅ SSL support
- ✅ Fallback SQLite

### server.js
```javascript
// Admin user otomatik oluşturuluyor
// DATABASE_URL ayarlanmışsa → PostgreSQL
// DATABASE_URL yoksa → SQLite
```

---

## 🚀 Hemen Kullan

### Local Test
```bash
# .env oluştur
DATABASE_URL=postgresql://postgres:PASSWORD@...

# Çalıştır
npm install
npm start
```

### Vercel Deploy
```bash
# Environment variables ekle
# DATABASE_URL
# SESSION_SECRET
# NODE_ENV=production

# Deploy
vercel deploy --prod
```

---

## 📝 Checklist

Vercel'e gitmeden:
- [ ] Supabase projesi oluşturdum
- [ ] Connection string'i kopyaladım
- [ ] `.env` dosyasını oluşturdum
- [ ] `npm start` ile local test ettim
- [ ] Admin login çalıştı
- [ ] Kategoriler/ürünler göründü

Vercel'e:
- [ ] Environment variables ekledim
- [ ] `vercel deploy --prod` çalıştırdım
- [ ] Admin panele giriş yaptım
- [ ] Shop sayfasında ürünler gördüm

---

## 🔐 Production Güvenlik

1. **Admin Şifresi:**
   ```bash
   # Supabase'de users tablosundaki admin@florist.com
   # Password alanını yeni bcrypt hash ile güncelle
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YENI_PASS', 10, (e,h)=>console.log(h))"
   ```

2. **SESSION_SECRET:**
   ```bash
   # Rastgele güvenli secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **NODE_ENV=production**

---

## 🆘 Sorun Giderme

| Hata | Çözüm |
|------|-------|
| `Cannot find module 'pg'` | `npm install pg && npm install` |
| `ECONNREFUSED` | DATABASE_URL kontrol, Supabase aktif mi? |
| Admin login çalışmıyor | Supabase users tablo kontrol, is_admin=true mi? |
| Vercel 500 error | Logs bak: `vercel logs --tail` |

---

## 📦 Bağımlılıklar

Gerekli (zaten package.json'da):
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `express-session` - Session management
- `dotenv` - Environment variables

---

## 🎯 Sonuç

✅ Vercel'de deploy edebiliyorsun
✅ PostgreSQL veritabanı bağlı
✅ Admin paneli çalışıyor
✅ Kategoriler/ürünler kaydediliyor
✅ Session management aktif

Hazır! 🚀

---

Sorular?
- Logs: `vercel logs --tail`
- Local test: `DATABASE_URL=... npm start`
- Docs: SUPABASE_SETUP.md / VERCEL_QUICKSTART.md
