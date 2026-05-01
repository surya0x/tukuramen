-- =============================================
-- PRODUCTION ADMIN SECURITY
-- Use this for production instead of "all authenticated users can write".
--
-- Steps:
-- 1. Create the Supabase Auth user for the Tuku Ramen admin first.
-- 2. Replace admin@tukuramen.com below with the actual admin email.
-- 3. Run this script in Supabase SQL Editor.
-- =============================================

CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read own admin record" ON admin_users;
CREATE POLICY "Admins can read own admin record"
ON admin_users FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Replace this email with the real production admin email.
INSERT INTO admin_users (user_id, email)
SELECT id, email
FROM auth.users
WHERE email = 'admin@tukuramen.com'
ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;

-- Keep public read for public website data.
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read branches" ON branches;
DROP POLICY IF EXISTS "Public read menu_items" ON menu_items;
DROP POLICY IF EXISTS "Public read packages" ON packages;
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
DROP POLICY IF EXISTS "Public read toppings" ON toppings;

CREATE POLICY "Public read categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read branches" ON branches FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read packages" ON packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read toppings" ON toppings FOR SELECT TO anon, authenticated USING (true);

-- Replace broad authenticated write policies with admin-only write policies.
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin full access branches" ON branches;
DROP POLICY IF EXISTS "Admin full access menu_items" ON menu_items;
DROP POLICY IF EXISTS "Admin full access packages" ON packages;
DROP POLICY IF EXISTS "Admin full access faqs" ON faqs;
DROP POLICY IF EXISTS "Admin full access toppings" ON toppings;

CREATE POLICY "Admin full access categories"
ON categories FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access branches"
ON branches FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access menu_items"
ON menu_items FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access packages"
ON packages FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access faqs"
ON faqs FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access toppings"
ON toppings FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete menu images" ON storage.objects;

CREATE POLICY "Public read menu images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'menu-images');

CREATE POLICY "Admin upload menu images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images' AND public.is_admin());

CREATE POLICY "Admin update menu images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'menu-images' AND public.is_admin())
WITH CHECK (bucket_id = 'menu-images' AND public.is_admin());

CREATE POLICY "Admin delete menu images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-images' AND public.is_admin());
