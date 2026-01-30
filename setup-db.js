#!/usr/bin/env node
/**
 * Database Setup Script - Online Florist
 * Bu script Supabase bağlantı stringini ayarlar
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('\n🌸 Online Florist - Database Setup\n');
  console.log('Supabase PostgreSQL yapılandırması için:\n');

  const dbUrl = await question('Supabase Connection String (DATABASE_URL) gir:\n> ');
  const sessionSecret = await question('\nSession Secret gir (32+ karakter):\n> ');

  if (!dbUrl.includes('postgresql://')) {
    console.error('\n❌ Hata: Geçerli PostgreSQL connection string değil!');
    process.exit(1);
  }

  const envPath = path.join(__dirname, '.env');
  const envContent = `# Database Configuration
DATABASE_URL=${dbUrl}

# Session Secret
SESSION_SECRET=${sessionSecret}

# Environment
NODE_ENV=production
PORT=3000
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✓ .env dosyası oluşturuldu!');
    console.log('\nSonraki adımlar:');
    console.log('1. npm install');
    console.log('2. npm start');
    console.log('\nAdmin giriş:');
    console.log('- Email: admin@florist.com');
    console.log('- Password: admin123');
    console.log('\n⚠️  Production için şifreyi değiştir!\n');
  } catch (err) {
    console.error('\n❌ Hata: .env yazılamadı:', err);
    process.exit(1);
  }

  rl.close();
}

setupDatabase().catch(err => {
  console.error('Setup hatası:', err);
  process.exit(1);
});
