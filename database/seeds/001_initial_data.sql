-- Seed: 001 – Initial Data
USE `store_rating_db`;

-- Passwords are bcrypt hashed (cost 10).
-- Plain-text values (CHANGE BEFORE PRODUCTION):
--   admin@platform.com  → Admin@1234!
--   owner1@store.com    → Owner@1234!
--   owner2@store.com    → Owner@1234!
--   user1@example.com   → User@1234!!
--   user2@example.com   → User@1234!!

INSERT INTO `users` (`name`, `email`, `password`, `address`, `role`) VALUES
(
  'System Administrator Account',
  'admin@platform.com',
  '$2b$10$YourBcryptHashHereAdminReplace123456',  -- CHANGEME: replace with real bcrypt hash
  '123 Admin Street, Platform City, PC 00001',
  'admin'
),
(
  'First Store Owner User',
  'owner1@store.com',
  '$2b$10$YourBcryptHashHereOwner1Replace1234',  -- CHANGEME
  '456 Owner Avenue, Commerce Town, CT 10001',
  'owner'
),
(
  'Second Store Owner User',
  'owner2@store.com',
  '$2b$10$YourBcryptHashHereOwner2Replace1234',  -- CHANGEME
  '789 Owner Boulevard, Commerce Town, CT 10002',
  'owner'
),
(
  'Regular Normal User One',
  'user1@example.com',
  '$2b$10$YourBcryptHashHereUser1Replace12345',  -- CHANGEME
  '321 User Lane, Suburb City, SC 20001',
  'user'
),
(
  'Regular Normal User Two',
  'user2@example.com',
  '$2b$10$YourBcryptHashHereUser2Replace12345',  -- CHANGEME
  '654 User Street, Suburb City, SC 20002',
  'user'
);

INSERT INTO `stores` (`name`, `email`, `address`, `owner_id`, `average_rating`, `rating_count`) VALUES
(
  'The Grand Coffee Experience Store',
  'grand.coffee@store.com',
  '100 Coffee Road, Brew District, BD 30001',
  (SELECT `id` FROM `users` WHERE `email` = 'owner1@store.com'),
  0.00,
  0
),
(
  'Tech Gadgets And Electronics Hub',
  'tech.gadgets@store.com',
  '200 Tech Avenue, Innovation Park, IP 30002',
  (SELECT `id` FROM `users` WHERE `email` = 'owner2@store.com'),
  0.00,
  0
),
(
  'Fresh Organic Grocery Market Place',
  'fresh.organic@store.com',
  '300 Green Street, Farm District, FD 30003',
  NULL,
  0.00,
  0
);
