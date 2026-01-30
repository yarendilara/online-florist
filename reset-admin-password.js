#!/usr/bin/env node
/**
 * Admin Password Reset Script
 * Kullanım: node reset-admin-password.js
 */

const bcrypt = require('bcryptjs');
const database = require('./src/utils/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetPassword() {
  console.log('\n🌸 Admin Şifre Sıfırlama\n');

  try {
    // Database bağlantısını test et
    await database.connect();
    console.log('✓ Veritabanına bağlandı\n');

    // Admin kullanıcısını bul
    const admin = await database.get(
      'SELECT * FROM users WHERE email = ?',
      ['admin@florist.com']
    );

    if (!admin) {
      console.log('❌ Admin kullanıcısı bulunamadı!');
      console.log('Lütfen admin@florist.com email ile başla\n');
      process.exit(1);
    }

    console.log('👤 Admin Bulundu: ' + admin.username + '\n');

    // Yeni şifre iste
    const newPassword = await question('Yeni şifre gir: ');
    const confirmPassword = await question('Şifreyi onayla: ');

    if (newPassword !== confirmPassword) {
      console.log('\n❌ Şifreler eşleşmiyor!');
      process.exit(1);
    }

    if (newPassword.length < 8) {
      console.log('\n❌ Şifre en az 8 karakter olmalı!');
      process.exit(1);
    }

    // Hash et
    console.log('\n🔐 Şifre hash'leniyor...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Güncelle
    await database.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      [hashedPassword, 'admin@florist.com']
    );

    console.log('✅ Admin şifresi başarıyla sıfırlandı!\n');
    console.log('Email: admin@florist.com');
    console.log('Yeni Şifre: ' + newPassword + '\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Hata:', err.message);
    process.exit(1);
  }
}

resetPassword();
