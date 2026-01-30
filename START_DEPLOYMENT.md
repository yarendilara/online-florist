# 🚀 BAŞLANGIÇ - Vercel Deploy İçin Database Kurulumu

**Durum:** ✅ Hazır! PostgreSQL ve Supabase entegrasyonu tamamlandı.

---

## ⚡ HEMEN BAŞLA (3 Adım)

### 1. Supabase Projesi Oluştur
- Git: [supabase.com](https://supabase.com)
- New Project → `online-florist`
- Settings → Database → Connection string (PostgreSQL) kopyala

### 2. .env Dosyası Oluştur
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@db.XXXXXX.supabase.co:5432/postgres
SESSION_SECRET=your_secret_key_here
```

### 3. Sunucuyu Başlat
```bash
npm install
npm start
```

**Login:** admin@florist.com / admin123

---

## 📋 Ne Değişti?

| Dosya | Değişim |
|-------|---------|
| `src/utils/database.js` | PostgreSQL + SQLite support |
| `src/server.js` | Admin auto-create |
| `vercel.json` | Yeni - Vercel config |
| `.env.example` | Yeni - Template |
| Dökümanlar | 5 yeni file |
| Scripts | 2 yeni helper script |

---

## 📚 Rehberi Oku

1. **[DEPLOY_CHECKLIST.html](./DEPLOY_CHECKLIST.html)** ← Bunu aç browser'da! (Resimli, adım adım)
2. [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detaylı Supabase kurulumu
3. [VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md) - Vercel deploy
4. [DEPLOYMENT_CHANGES.md](./DEPLOYMENT_CHANGES.md) - Yapılan değişikliklerin listesi

---

## ✅ Quick Checklist

- [ ] Supabase projesi oluşturdum
- [ ] Connection string kopyaladım
- [ ] .env dosyası oluşturdm
- [ ] npm start çalıştırdım
- [ ] Admin login'i test ettim
- [ ] Kategoriler/ürünleri ekledim
- [ ] Vercel'e deploy ettim

---

## 🆘 Hızlı Sorun Giderme

```bash
# Test et (yerel)
DATABASE_URL=postgresql://... npm start

# Logs bak (Vercel)
vercel logs --tail

# Admin şifre sıfırla
npm run reset-admin

# Setup wizard'ı çalıştır
npm run setup-db
```

---

## 🎯 Sonraki Adımlar

1. Admin şifresini değiştir (production için)
2. Ürün resimleri ekle (`/public/images/`)
3. Payment gateway entegre et
4. Email notifications kur

---

## 📦 Teknik Bilgi

**Database:** PostgreSQL (Supabase managed)
**Server:** Express.js
**Session:** express-session + PostgreSQL
**Auth:** bcryptjs
**Hosting:** Vercel (serverless)

**Constraints:**
- Vercel Function timeout: 300s
- Memory: 1024MB
- SQLite fallback: Eğer DATABASE_URL yoksa

---

## 🌐 Links

- 🔗 [Supabase](https://supabase.com)
- 🔗 [Vercel](https://vercel.com)
- 🔗 [PostgreSQL Docs](https://www.postgresql.org/docs/)
- 🔗 [Express.js](https://expressjs.com/)

---

## 💬 Sorular?

Loglara bak:
```bash
# Local sorun
npm start 2>&1 | tail -20

# Vercel sorun
vercel logs --tail --verbose
```

---

**Hazır mısın?** Başla: `npm start` 🌸

---

## 🔐 Security Checklist (Production)

- [ ] Admin şifresi değiştirildi
- [ ] SESSION_SECRET randomized (32+ chars)
- [ ] NODE_ENV=production
- [ ] HTTPS enabled (Vercel otomatik)
- [ ] Database backups configured

---

**Last Updated:** January 31, 2026
**Status:** ✅ Production Ready
