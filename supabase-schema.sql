-- =============================================
-- TUKU RAMEN DATABASE SCHEMA
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Branches
CREATE TABLE branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  maps_link TEXT,
  phone TEXT,
  whatsapp TEXT,
  operating_hours JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Menu Items
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INT NOT NULL,
  image_url TEXT,
  is_spicy BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Packages
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INT NOT NULL,
  description TEXT,
  items TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. FAQs
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Toppings
CREATE TABLE toppings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- SEED DATA
-- =============================================

-- Categories
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Signature Ramen', 'signature-ramen', 1),
  ('Variasi Ramen', 'variasi-ramen', 2),
  ('Donburi', 'donburi', 3),
  ('Sides', 'sides', 4),
  ('Minuman', 'minuman', 5),
  ('Dessert', 'dessert', 6);

-- Branches
INSERT INTO branches (name, slug, address, maps_link, whatsapp, operating_hours) VALUES
  ('Tuku Ramen Ciputat', 'ciputat', 'Jl. Tarumanegara No.83A, Cireundeu, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15419', 'https://maps.app.goo.gl/7GJkVvbRbFt3f2pe7', 'https://bit.ly/reservasiciputat', '{"mon":"10:30-23:00","tue":"10:30-23:00","wed":"10:30-23:00","thu":"10:30-23:00","fri":"10:30-23:00","sat":"10:30-23:00","sun":"10:30-23:00"}'),
  ('Tuku Ramen Pondok Ranji', 'pondok-ranji', 'Jl. W R Supratman Ruko No.02, RT.005/RW.10, Rengas, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15412', 'https://maps.app.goo.gl/qJ88piw3moKapKRu5', 'https://bit.ly/reservasipondokranji', '{"mon":"16:00-23:00","tue":"16:00-23:00","wed":"16:00-23:00","thu":"16:00-23:00","fri":"16:00-23:00","sat":"16:00-23:00","sun":"16:00-23:00"}');

-- Menu Items (Signature Ramen)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'signature-ramen'), 'Red Ramen', 'Ramen dengan topping telur, chicken chashu, jagung, pakcoy, dan kuah pedas gurih', 34000, true, 1),
  ((SELECT id FROM categories WHERE slug = 'signature-ramen'), 'Tori Paitan Ramen', 'Ramen dengan topping chicken chashu, telur, jagung, daun bawang, nori, dan kaldu ayam kental', 34000, true, 2),
  ((SELECT id FROM categories WHERE slug = 'signature-ramen'), 'Suppai Ramen', 'Ramen dengan topping telur, ayam cincang, nori, dengan cita rasa asam pedas', 34000, true, 3),
  ((SELECT id FROM categories WHERE slug = 'signature-ramen'), 'Sukemen', 'Ramen dengan topping telur, chicken chashu, nori, dengan rasa asam pedas', 32000, true, 4),
  ((SELECT id FROM categories WHERE slug = 'signature-ramen'), 'Red Yasai Ramen', 'Ramen dengan topping kol, tauge, chicken chashu, daun bawang, dan kuah pedas gurih', 33000, true, 5);

-- Menu Items (Variasi Ramen)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Chicken Katsu Ramen', 'Ramen dengan topping chicken katsu, telur, daun bawang, dan nori', 34000, false, 1),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Dry Ramen', 'Ramen kering dengan bumbu gurih, topping telur dan chicken chashu', 34000, false, 2),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Mazesoba', 'Ramen tanpa kuah dengan topping ayam cincang, telur, nori, daun bawang', 34000, false, 3),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Matching Tofu', 'Ramen dengan topping tofu, ayam cincang, nori, rasa asam gurih, dan kuah kental', 34000, false, 4),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Yakisoba', 'Mi goreng Jepang dengan topping telur, sayur, dan bumbu yakisoba', 33000, false, 5),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Spicy Dry Ramen', 'Ramen kering pedas dengan topping chicken chashu, telur, dan nori', 34000, true, 6),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Laksamana', 'Ramen dengan kuah laksa, topping ayam, telur, dan bumbu rempah', 33000, false, 7),
  ((SELECT id FROM categories WHERE slug = 'variasi-ramen'), 'Curry Ramen / Rice', 'Ramen atau nasi dengan topping chicken katsu dan kari Jepang. Pilihan ramen atau nasi', 34000, false, 8);

-- Menu Items (Donburi)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'donburi'), 'Chicken Katsu Don', 'Nasi dengan topping chicken katsu, telur, dan saus donburi', 30000, false, 1),
  ((SELECT id FROM categories WHERE slug = 'donburi'), 'Chicken Teriyaki Don', 'Nasi dengan topping ayam teriyaki, sayuran, dan saus teriyaki', 30000, false, 2),
  ((SELECT id FROM categories WHERE slug = 'donburi'), 'Gyudon', 'Nasi dengan topping irisan daging sapi, bawang bombay, dan telur', 34000, false, 3);

-- Menu Items (Sides)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'sides'), 'Gyoza (3 Pcs)', 'Pangsit goreng isi ayam, 3 buah', 12000, false, 1),
  ((SELECT id FROM categories WHERE slug = 'sides'), 'Gyoza (5 Pcs)', 'Pangsit goreng isi ayam, 5 buah', 18000, false, 2),
  ((SELECT id FROM categories WHERE slug = 'sides'), 'Chicken Karage (5 Pcs)', 'Ayam goreng tepung ala Jepang, 5 potong', 18000, false, 3),
  ((SELECT id FROM categories WHERE slug = 'sides'), 'Takoyaki (4 Pcs)', 'Bola-bola tepung isi gurita, 4 buah', 15000, false, 4),
  ((SELECT id FROM categories WHERE slug = 'sides'), 'Ebi Furai (3 Pcs)', 'Udang goreng tepung roti, 3 buah', 18000, false, 5);

-- Menu Items (Minuman)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'minuman'), 'Ocha', 'Teh hijau Jepang dingin', 5000, false, 1),
  ((SELECT id FROM categories WHERE slug = 'minuman'), 'Es Teh Manis', 'Teh manis dingin', 5000, false, 2),
  ((SELECT id FROM categories WHERE slug = 'minuman'), 'Es Teler', 'Minuman segar dengan kelapa, alpukat, dan nangka', 12000, false, 3),
  ((SELECT id FROM categories WHERE slug = 'minuman'), 'Teh Manis', 'Teh manis hangat', 4000, false, 4);

-- Menu Items (Dessert)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'dessert'), 'Puding', 'Puding susu lembut', 5000, false, 1);

-- Attach the initial menu to Ciputat, then duplicate it for Pondok Ranji.
-- Admin can edit/delete each branch copy independently after this seed runs.
UPDATE menu_items
SET branch_id = (SELECT id FROM branches WHERE slug = 'ciputat')
WHERE branch_id IS NULL;

INSERT INTO menu_items (category_id, branch_id, name, description, price, image_url, is_spicy, is_available, sort_order)
SELECT
  category_id,
  (SELECT id FROM branches WHERE slug = 'pondok-ranji'),
  name,
  description,
  price,
  image_url,
  is_spicy,
  is_available,
  sort_order
FROM menu_items
WHERE branch_id = (SELECT id FROM branches WHERE slug = 'ciputat');

-- Packages
INSERT INTO packages (name, price, description, items, sort_order) VALUES
  ('Paket Hemat 1', 50000, 'Pilihan Signature Ramen + Gyoza (3 Pcs) + Es Teh Manis', ARRAY['Signature Ramen (pilihan)', 'Gyoza (3 Pcs)', 'Es Teh Manis'], 1),
  ('Paket Hemat 2', 90000, 'Pilihan Signature Ramen + Gyoza (3 Pcs) + 2 Es Teh Manis (untuk 2 orang)', ARRAY['2x Signature Ramen (pilihan)', 'Gyoza (3 Pcs)', '2x Es Teh Manis'], 2),
  ('Paket Buka Sendiri', 52000, 'Signature Ramen + 1 Es Teler + 1 Teh Manis', ARRAY['Signature Ramen (pilihan)', 'Es Teler', 'Teh Manis'], 3),
  ('Paket Rame-Rame', 150000, 'Untuk 4 orang: 4 Signature Ramen + 2 Gyoza (5 Pcs) + 4 Es Teh Manis', ARRAY['4x Signature Ramen (pilihan)', '2x Gyoza (5 Pcs)', '4x Es Teh Manis'], 4),
  ('Paket Date Night', 85000, 'Untuk 2 orang: 2 Signature Ramen + 1 Gyoza (5 Pcs) + 2 Ocha', ARRAY['2x Signature Ramen (pilihan)', 'Gyoza (5 Pcs)', '2x Ocha'], 5);

-- FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Apakah Tuku Ramen halal?', 'Ya, Tuku Ramen 100% halal. Semua bahan baku kami dijamin halal dan tidak menggunakan babi atau alkohol dalam proses masak.', 1),
  ('Apa menu paling populer?', 'Red Ramen dan Tori Paitan Ramen adalah menu paling populer di kedua cabang kami.', 2),
  ('Apakah bisa pilih tingkat kepedasan?', 'Ya! Untuk semua Signature Ramen, kamu bisa pilih Level 0 (tidak pedas/gratis), Level 1 (+3k), Level 2 (+4k), atau Level 3 (+5k).', 3),
  ('Ada berapa cabang Tuku Ramen?', 'Saat ini kami memiliki 2 cabang: Tuku Ramen Ciputat dan Tuku Ramen Pondok Ranji, keduanya di Tangerang Selatan.', 4),
  ('Apakah bisa pesan delivery?', 'Ya, kamu bisa pesan melalui GoFood dan GrabFood. Cari "Tuku Ramen" di aplikasi.', 5),
  ('Apakah ada paket hemat?', 'Ya! Kami punya beberapa paket hemat mulai dari Rp 50.000 yang sudah termasuk ramen, side dish, dan minuman.', 6);

-- Toppings
INSERT INTO toppings (name, price) VALUES
  ('Extra Nori', 3000),
  ('Extra Jagung', 3000),
  ('Extra Telur', 5000),
  ('Extra Chicken Chashu', 7000),
  ('Extra Mie', 5000),
  ('Extra Nasi', 5000),
  ('Extra Kuah', 3000);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read toppings" ON toppings FOR SELECT USING (true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access branches" ON branches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access packages" ON packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access toppings" ON toppings FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE
-- =============================================
-- Public bucket for menu item photos uploaded from /admin/menu.
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE POLICY "Admin upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update menu images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete menu images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
