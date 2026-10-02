/**
 migrate.js – Run all SQL migration files in order against the configured DB.
 Usage: node migrate.js
 Env:   DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
 */
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function run() {
  const dbName = process.env.DB_NAME || 'store_rating_db';

  const adminConn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
    multipleStatements: true,
  });

  await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await adminConn.end();

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
    database: dbName,
    multipleStatements: true,
  });

  console.log('📦  Running migrations...');
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`  ▶ ${file}`);
    await conn.query(sql);
    console.log(`  ✅ ${file} done`);
  }

  await conn.end();
  console.log('✔  All migrations complete.');
}

run().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
