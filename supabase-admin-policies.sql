-- =============================================
-- ADMIN WRITE POLICIES
-- Run this if admin insert/update/delete fails.
-- It keeps public read access, but only authenticated users can write.
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin full access branches" ON branches;
DROP POLICY IF EXISTS "Admin full access menu_items" ON menu_items;
DROP POLICY IF EXISTS "Admin full access packages" ON packages;
DROP POLICY IF EXISTS "Admin full access faqs" ON faqs;
DROP POLICY IF EXISTS "Admin full access toppings" ON toppings;

CREATE POLICY "Admin full access categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access branches"
ON branches FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access menu_items"
ON menu_items FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access packages"
ON packages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access faqs"
ON faqs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin full access toppings"
ON toppings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete menu images" ON storage.objects;

CREATE POLICY "Public read menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE POLICY "Admin upload menu images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Admin update menu images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Admin delete menu images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-images');
