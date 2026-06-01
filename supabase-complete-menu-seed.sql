-- =============================================
-- TUKU RAMEN COMPLETE MENU DATA
-- Run this after the tables already exist.
-- This script updates existing rows and inserts missing rows for both branches.
-- =============================================

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Signature Ramen', 'signature-ramen', 1),
  ('Variasi Ramen', 'variasi-ramen', 2),
  ('Donburi', 'donburi', 3),
  ('Sides', 'sides', 4),
  ('Topping', 'topping', 5),
  ('Minuman', 'minuman', 6),
  ('Dessert', 'dessert', 7),
  ('Paket', 'paket', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO branches (name, slug, address, maps_link, whatsapp, operating_hours) VALUES
  ('Tuku Ramen Ciputat', 'ciputat', 'Jl. Ir. H. Juanda, Ciputat, Tangerang Selatan, Banten', 'https://maps.app.goo.gl/7GJkVvbRbFt3f2pe7', 'https://bit.ly/reservasiciputat', '{"mon":"10:30-23:00","tue":"10:30-23:00","wed":"10:30-23:00","thu":"10:30-23:00","fri":"10:30-23:00","sat":"10:30-23:00","sun":"10:30-23:00"}'),
  ('Tuku Ramen Pondok Ranji', 'pondok-ranji', 'Jl. Pondok Ranji, Ciputat Timur, Tangerang Selatan, Banten', 'https://maps.app.goo.gl/qJ88piw3moKapKRu5', 'https://bit.ly/reservasipondokranji', '{"mon":"16:00-23:00","tue":"16:00-23:00","wed":"16:00-23:00","thu":"16:00-23:00","fri":"16:00-23:00","sat":"16:00-23:00","sun":"16:00-23:00"}')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  maps_link = EXCLUDED.maps_link,
  whatsapp = EXCLUDED.whatsapp,
  operating_hours = EXCLUDED.operating_hours;

WITH menu_seed (category_slug, name, price, description, is_spicy, sort_order) AS (
  VALUES
    ('signature-ramen', 'Red Ramen', 34000, 'Ramen dengan topping telur, chicken chashu, jagung, pakcoy, dan kuah pedas gurih', true, 1),
    ('signature-ramen', 'Tori Paitan Ramen', 34000, 'Ramen dengan topping chicken chashu, telur, jagung, daun bawang, nori, dan kaldu ayam yang kental', true, 2),

    ('variasi-ramen', 'Suppai Ramen', 34000, 'Ramen dengan topping telur, ayam cincang, nori, dengan cita rasa asam pedas', true, 1),
    ('variasi-ramen', 'Sukemen', 32000, 'Ramen dengan topping telur, chicken chashu, nori, dengan rasa asam pedas', true, 2),
    ('variasi-ramen', 'Red Yasai Ramen', 33000, 'Ramen dengan topping kol, tauge, chicken chashu, daun bawang, dan kuah pedas gurih', true, 3),
    ('variasi-ramen', 'Chicken Katsu Ramen', 33000, 'Ramen dengan topping chicken katsu, daun bawang, dan nori', false, 4),
    ('variasi-ramen', 'Mazesoba', 33000, 'Ramen kering dengan ayam cincang, chicken chashu, telur, nori, daun bawang, rasa manis asin gurih', false, 5),
    ('variasi-ramen', 'Maboh Tofu', 34000, 'Ramen dengan topping tahu, ayam cincang, rasa asin gurih, dan kuah kental', false, 6),
    ('variasi-ramen', 'Yakisoba', 32000, 'Ramen kering dengan topping kol, tauge, wortel, nira ayam, rasa manis asam gurih', false, 7),
    ('variasi-ramen', 'Curry Ramen / Rice', 34000, 'Kari dengan topping chicken katsu dan nori. Pilihan ramen atau nasi', false, 8),

    ('donburi', 'Chicken Yakiniku Donburi Original', 29000, 'Donburi dengan topping ayam, bombay, jagung, kol, wortel, dan slada. Rasa manis, asin, dan gurih', false, 1),
    ('donburi', 'Chicken Yakiniku Donburi Spicy', 30000, 'Varian pedas dari Chicken Yakiniku Donburi dengan topping ayam, bombay, jagung, kol, wortel, dan slada', true, 2),
    ('donburi', 'Chicken Teriyaki Donburi', 29000, 'Donburi dengan topping ayam, jagung, kol, dan wortel rasa manis gurih', false, 3),
    ('donburi', 'Chicken Katsu Donburi', 29000, 'Donburi dengan topping chicken katsu, jagung, kol, wortel, dan slada. Rasa asin dan gurih', false, 4),
    ('donburi', 'Chahan', 24000, 'Nasi goreng Jepang dengan topping ayam, jagung, dan daun bawang rasa asin gurih', false, 5),

    ('sides', 'Tori Mayo', 27000, 'Ayam goreng dengan saus mayo', false, 1),
    ('sides', 'Ebi Furai', 27000, 'Udang goreng tepung', false, 2),
    ('sides', 'Karage', 25000, 'Ayam goreng ala Jepang', false, 3),
    ('sides', 'Yaki Gyoza', 25000, 'Gyoza panggang', false, 4),
    ('sides', 'Age Gyoza', 24000, 'Gyoza goreng', false, 5),

    ('minuman', 'Ocha', 7000, 'Teh hijau Jepang - Free Refill', false, 1),
    ('minuman', 'Sweet Tea (Ice)', 6000, 'Es teh manis', false, 2),
    ('minuman', 'Sweet Tea (Hot)', 5000, 'Teh manis hangat', false, 3),
    ('minuman', 'Mineral Water', 5000, 'Air mineral', false, 4),
    ('minuman', 'Coca Cola', 10000, 'Coca Cola dingin', false, 5),
    ('minuman', 'Lemon Tea', 8000, 'Teh lemon segar', false, 6),
    ('minuman', 'Orange Juice', 12000, 'Jus jeruk segar', false, 7),

    ('dessert', 'Putu Puding Tuku', 13000, 'Puding khas Tuku Ramen', false, 1),
    ('dessert', 'Esteler Tuku', 15000, 'Es teler khas Tuku Ramen', false, 2)
),
branch_seed AS (
  SELECT id, slug FROM branches WHERE slug IN ('ciputat', 'pondok-ranji')
),
resolved_seed AS (
  SELECT
    c.id AS category_id,
    b.id AS branch_id,
    m.name,
    m.description,
    m.price,
    m.is_spicy,
    m.sort_order
  FROM menu_seed m
  JOIN categories c ON c.slug = m.category_slug
  CROSS JOIN branch_seed b
),
updated AS (
  UPDATE menu_items existing
  SET
    category_id = seed.category_id,
    description = seed.description,
    price = seed.price,
    is_spicy = seed.is_spicy,
    is_available = true,
    sort_order = seed.sort_order
  FROM resolved_seed seed
  WHERE existing.branch_id = seed.branch_id
    AND existing.name = seed.name
  RETURNING existing.id
)
INSERT INTO menu_items (category_id, branch_id, name, description, price, is_spicy, is_available, sort_order)
SELECT
  seed.category_id,
  seed.branch_id,
  seed.name,
  seed.description,
  seed.price,
  seed.is_spicy,
  true,
  seed.sort_order
FROM resolved_seed seed
WHERE NOT EXISTS (
  SELECT 1
  FROM menu_items existing
  WHERE existing.branch_id = seed.branch_id
    AND existing.name = seed.name
);

-- Merge old Yakiniku names into the current names if your database already has them.
UPDATE menu_items
SET name = 'Chicken Yakiniku Donburi Original'
WHERE name = 'Chicken Yakiniku Don (Original)';

UPDATE menu_items
SET name = 'Chicken Yakiniku Donburi Spicy'
WHERE name = 'Chicken Yakiniku Don (Spicy)';

WITH topping_seed (name, price) AS (
  VALUES
    ('Chicken Katsu', 12000),
    ('Chicken Teriyaki', 12000),
    ('Tori Chasiu', 11000),
    ('Ayam Cincang', 11000),
    ('Tamago', 5000),
    ('Ramen (extra)', 7000),
    ('Nasi', 5000),
    ('Nori (3 lembar)', 6000),
    ('Fish Roll', 6000),
    ('Chikuwa', 6000),
    ('Scallop', 6000),
    ('Jagung', 5000),
    ('Naruto Maki', 5000),
    ('Tauge', 5000),
    ('Pakcoy', 5000),
    ('Cabe Potong', 5000)
),
updated_toppings AS (
  UPDATE toppings t
  SET price = seed.price, is_available = true
  FROM topping_seed seed
  WHERE t.name = seed.name
  RETURNING t.id
)
INSERT INTO toppings (name, price, is_available)
SELECT seed.name, seed.price, true
FROM topping_seed seed
WHERE NOT EXISTS (
  SELECT 1 FROM toppings t WHERE t.name = seed.name
);

WITH package_seed (name, price, description, items, sort_order) AS (
  VALUES
    ('Paket Hemat 1', 50000, 'Pilihan Signature Ramen + 3 Pcs Gyoza + Es Teh Manis/Ocha/Mineral Water', ARRAY['Signature Ramen (pilihan)', 'Gyoza (3 Pcs)', 'Es Teh Manis/Ocha/Mineral Water'], 1),
    ('Paket Hemat 2', 90000, '2 Pilihan Signature Ramen + 3 Pcs Gyoza + 2 Es Teh Manis/Ocha/Mineral Water', ARRAY['2x Signature Ramen (pilihan)', 'Gyoza (3 Pcs)', '2x Es Teh Manis/Ocha/Mineral Water'], 2),
    ('Paket Buka Sendiri', 52000, 'Signature Ramen + 1 Es Teler + 1 Teh Manis', ARRAY['Signature Ramen', 'Es Teler', 'Teh Manis'], 3),
    ('Paket Ramadhan 1', 360000, '10 Porsi Ramen (bebas pilih) + 1 Porsi Gyoza + 1 Porsi Karage + Free Takjil Kurma', ARRAY['10x Ramen (bebas pilih)', '1x Gyoza', '1x Karage', 'Free Takjil Kurma'], 4),
    ('Paket Ramadhan 2', 190000, '5 Porsi Ramen (bebas pilih) + 1 Porsi Gyoza + Free Takjil Kurma', ARRAY['5x Ramen (bebas pilih)', '1x Gyoza', 'Free Takjil Kurma'], 5)
),
updated_packages AS (
  UPDATE packages p
  SET
    price = seed.price,
    description = seed.description,
    items = seed.items,
    sort_order = seed.sort_order,
    is_available = true
  FROM package_seed seed
  WHERE p.name = seed.name
  RETURNING p.id
)
INSERT INTO packages (name, price, description, items, is_available, sort_order)
SELECT seed.name, seed.price, seed.description, seed.items, true, seed.sort_order
FROM package_seed seed
WHERE NOT EXISTS (
  SELECT 1 FROM packages p WHERE p.name = seed.name
);

SELECT
  b.slug AS branch,
  c.name AS category,
  count(m.id) AS total_menu
FROM menu_items m
JOIN branches b ON b.id = m.branch_id
JOIN categories c ON c.id = m.category_id
GROUP BY b.slug, c.name
ORDER BY b.slug, c.name;
