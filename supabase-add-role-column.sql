-- =============================================
-- MIGRATION: ADD ROLE COLUMN TO admin_users
-- =============================================
-- Catatan:
-- Skrip ini hanya perlu dijalankan di project yang sudah memakai schema
-- lama (sebelum kolom `role` ditambahkan ke `admin_users`).
--
-- Untuk project baru, langsung jalankan `supabase-production-admin-security.sql`
-- karena file tersebut sudah include kolom `role` dan policy RLS-nya.
-- =============================================

-- 1. Tambah kolom `role` dengan default 'admin'
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'
  CHECK (role IN ('admin', 'owner'));

-- 2. Lihat semua admin yang sudah terdaftar
-- SELECT au.user_id, au.email, au.role FROM admin_users au;

-- =============================================
-- TAMBAH AKUN BARU
-- =============================================
-- 1) Buat user dulu di Supabase Dashboard > Authentication > Users > Add user
-- 2) Setelah user dibuat, jalankan INSERT berikut
--    (ganti email sesuai akun yang baru dibuat)

-- Tambah akun owner
-- INSERT INTO admin_users (user_id, email, role)
-- SELECT id, email, 'owner' FROM auth.users WHERE email = 'owner@tukuramen.com';

-- Tambah akun admin
-- INSERT INTO admin_users (user_id, email, role)
-- SELECT id, email, 'admin' FROM auth.users WHERE email = 'admin@tukuramen.com';

-- =============================================
-- UPDATE ROLE AKUN YANG SUDAH ADA
-- =============================================
-- Promote akun ke owner
-- UPDATE admin_users SET role = 'owner' WHERE email = 'owner@tukuramen.com';

-- Demote akun ke admin
-- UPDATE admin_users SET role = 'admin' WHERE email = 'admin@tukuramen.com';
