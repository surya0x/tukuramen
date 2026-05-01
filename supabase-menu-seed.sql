-- =============================================
-- TUKU RAMEN MENU SEED ONLY
-- Safe to run after tables already exist.
-- Inserts the old hardcoded menu into both branches without duplicating existing rows.
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
  ('Tuku Ramen Ciputat', 'ciputat', 'Jl. Ir. H. Juanda, Ciputat, Tangerang Selatan, Banten', 'https://maps.google.com', 'https://bit.ly/reservasiciputat', '{"mon":"10:30-23:00","tue":"10:30-23:00","wed":"10:30-23:00","thu":"10:30-23:00","fri":"10:30-23:00","sat":"10:30-23:00","sun":"10:30-23:00"}'),
  ('Tuku Ramen Pondok Ranji', 'pondok-ranji', 'Jl. Pondok Ranji, Ciputat Timur, Tangerang Selatan, Banten', 'https://maps.google.com', 'https://bit.ly/reservasipondokranji', '{"mon":"16:00-23:00","tue":"16:00-23:00","wed":"16:00-23:00","thu":"16:00-23:00","fri":"16:00-23:00","sat":"16:00-23:00","sun":"16:00-23:00"}')
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

    ('donburi', 'Chahan', 24000, 'Nasi goreng khas Jepang dengan topping ayam, jagung, daun bawang, rasa asin gurih', false, 1),
    ('donburi', 'Chicken Yakiniku Don (Original)', 29000, 'Donburi dengan topping ayam, bawang bombay, jagung, kol, wortel, dan selada', false, 2),
    ('donburi', 'Chicken Yakiniku Don (Spicy)', 30000, 'Varian pedas dari Chicken Yakiniku Donburi', true, 3),
    ('donburi', 'Chicken Teriyaki Donburi', 29000, 'Nasi dengan topping ayam, jagung, kol, wortel dengan rasa manis gurih', false, 4),
    ('donburi', 'Chicken Katsu Donburi', 29000, 'Nasi dengan topping chicken katsu, jagung, kol, wortel, selada, rasa asin gurih', false, 5),

    ('sides', 'Karage', 25000, 'Ayam goreng khas Jepang', false, 1),
    ('sides', 'Yaki Gyoza', 24000, 'Gyoza panggang', false, 2),
    ('sides', 'Age Gyoza', 24000, 'Gyoza goreng', false, 3),
    ('sides', 'Tori Mayo', 27000, 'Ayam dengan saus mayones', false, 4),
    ('sides', 'Ebi Furai', 27000, 'Udang goreng tepung', false, 5),

    ('minuman', 'Sweet Tea (Hot)', 5000, 'Teh manis hangat', false, 1),
    ('minuman', 'Sweet Tea (Ice)', 6000, 'Es teh manis', false, 2),
    ('minuman', 'Ocha', 7000, 'Teh hijau Jepang - Free Refill', false, 3),
    ('minuman', 'Lemon Tea', 8000, 'Teh lemon segar', false, 4),
    ('minuman', 'Coca Cola', 10000, 'Coca Cola dingin', false, 5),
    ('minuman', 'Orange Juice', 12000, 'Jus jeruk segar', false, 6),
    ('minuman', 'Mineral Water', 5000, 'Air mineral', false, 7),

    ('dessert', 'Putu Puding Tuku', 13000, 'Puding khas Tuku Ramen', false, 1),
    ('dessert', 'Esteler Tuku', 15000, 'Es teler khas Tuku Ramen', false, 2)
),
branch_seed AS (
  SELECT id, slug FROM branches WHERE slug IN ('ciputat', 'pondok-ranji')
)
INSERT INTO menu_items (category_id, branch_id, name, description, price, is_spicy, is_available, sort_order)
SELECT
  c.id,
  b.id,
  m.name,
  m.description,
  m.price,
  m.is_spicy,
  true,
  m.sort_order
FROM menu_seed m
JOIN categories c ON c.slug = m.category_slug
CROSS JOIN branch_seed b
WHERE NOT EXISTS (
  SELECT 1
  FROM menu_items existing
  WHERE existing.branch_id = b.id
    AND existing.category_id = c.id
    AND existing.name = m.name
);
