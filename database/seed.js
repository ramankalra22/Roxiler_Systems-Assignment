/*
 seed.js – Generate real bcrypt hashes and insert seed data.
 Usage: node seed.js
 Env:   DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
 */
const mysql  = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path   = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const SALT_ROUNDS = 10;

const USERS = [
  { name: 'System Administrator Account', email: 'admin@platform.com',  password: 'Admin@1234!',  address: '123 Admin Street, Platform City, PC 00001',        role: 'admin'  },
  { name: 'First Store Owner User',        email: 'owner1@store.com',    password: 'Owner@1234!',  address: '456 Owner Avenue, Commerce Town, CT 10001',       role: 'owner'  },
  { name: 'Second Store Owner User',       email: 'owner2@store.com',    password: 'Owner@1234!',  address: '789 Owner Boulevard, Commerce Town, CT 10002',    role: 'owner'  },
  { name: 'Regular Normal User One',       email: 'user1@example.com',   password: 'User@1234!!',  address: '321 User Lane, Suburb City, SC 20001',            role: 'user'   },
  { name: 'Regular Normal User Two',       email: 'user2@example.com',   password: 'User@1234!!',  address: '654 User Street, Suburb City, SC 20002',          role: 'user'   },
];

async function run() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
    database: process.env.DB_NAME     || 'store_rating_db',
  });

  console.log('  Seeding users...');
  const userIds = {};

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [u.email]);
    if (existing.length > 0) {
      console.log(`    ${u.email} already exists, skipping`);
      userIds[u.email] = existing[0].id;
      continue;
    }
    const [res] = await conn.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [u.name, u.email, hash, u.address, u.role]
    );
    userIds[u.email] = res.insertId;
    console.log(`   ${u.email} (${u.role}) created`);
  }

  console.log('  Seeding stores...');
  const STORES = [
    { name: 'The Grand Coffee Experience Store', email: 'grand.coffee@store.com',  address: '100 Coffee Road, Brew District, BD 30001',      ownerEmail: 'owner1@store.com' },
    { name: 'Tech Gadgets And Electronics Hub',  email: 'tech.gadgets@store.com',  address: '200 Tech Avenue, Innovation Park, IP 30002',    ownerEmail: 'owner2@store.com' },
    { name: 'Fresh Organic Grocery Market Place',email: 'fresh.organic@store.com', address: '300 Green Street, Farm District, FD 30003',      ownerEmail: null               },
  ];

  for (const s of STORES) {
    const [existing] = await conn.query('SELECT id FROM stores WHERE email = ?', [s.email]);
    if (existing.length > 0) { console.log(`    ${s.email} already exists, skipping`); continue; }
    const ownerId = s.ownerEmail ? userIds[s.ownerEmail] : null;
    await conn.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [s.name, s.email, s.address, ownerId]
    );
    console.log(`   Store "${s.name}" created`);
  }

  await conn.end();
  console.log('  Seeding complete.');
  console.log('\nSeed credentials:');
  console.log('  admin@platform.com  → Admin@1234!  (admin)');
  console.log('  owner1@store.com    → Owner@1234!  (owner)');
  console.log('  owner2@store.com    → Owner@1234!  (owner)');
  console.log('  user1@example.com   → User@1234!!  (user)');
  console.log('  user2@example.com   → User@1234!!  (user)');
}

run().catch(err => { console.error('Seeding failed:', err.message); process.exit(1); });
