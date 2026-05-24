# Tuku Ramen Website

Website dan admin dashboard untuk Tuku Ramen. Aplikasi ini memakai Next.js App Router, Supabase Auth, Supabase Database, dan Supabase Storage untuk mengelola landing page, menu per cabang, paket, FAQ, serta gambar menu.

## Fitur Utama

- Landing page mobile-first dengan informasi brand, menu pilihan, paket, cabang, FAQ, dan CTA reservasi.
- Halaman menu publik dengan filter cabang `ciputat` dan `pondok-ranji`.
- Admin dashboard untuk CRUD cabang, menu, paket, dan FAQ.
- Menu dapat dibedakan per cabang karena `menu_items` terhubung ke `branches`.
- Upload gambar menu ke Supabase Storage bucket `menu-images`.
- Proteksi admin memakai Supabase Auth, RLS, dan allowlist tabel `admin_users`.

## Use Case Diagram

```mermaid
flowchart LR
  Visitor["Pengunjung"]:::actor
  Admin["Admin"]:::actor
  Owner["Owner"]:::actor
  Auth["Supabase Auth"]:::system
  Storage["Supabase Storage"]:::system
  WA["WhatsApp"]:::system

  subgraph System["Sistem Website Tuku Ramen"]
    UC1(["Melihat landing page"])
    UC2(["Melihat menu publik"])
    UC3(["Filter menu per cabang"])
    UC4(["Melihat paket, cabang, dan FAQ"])
    UC5(["Melakukan reservasi via WhatsApp"])

    UC6(["Login dashboard"])
    UC7(["Toggle status menu (Sold Out)"])
    UC8(["Update harga dan deskripsi menu"])
    UC9(["Update FAQ"])
    UC10(["Update jam operasional cabang"])
    UC11(["Upload gambar menu"])

    UC12(["Tambah atau hapus menu"])
    UC13(["Tambah atau hapus paket"])
    UC14(["Tambah atau hapus cabang"])
    UC15(["Manage admin users"])
  end

  Visitor --> UC1
  Visitor --> UC2
  Visitor --> UC3
  Visitor --> UC4
  Visitor --> UC5
  UC5 -.->|"&laquo;include&raquo;"| WA

  Admin --> UC6
  Admin --> UC7
  Admin --> UC8
  Admin --> UC9
  Admin --> UC10
  Admin --> UC11
  UC6 -.->|"&laquo;include&raquo;"| Auth
  UC11 -.->|"&laquo;include&raquo;"| Storage

  Owner --> UC12
  Owner --> UC13
  Owner --> UC14
  Owner --> UC15
  Owner -.->|"&laquo;generalize&raquo;"| Admin

  classDef actor fill:#fff7ed,stroke:#c2410c,stroke-width:2px;
  classDef system fill:#eef2ff,stroke:#4338ca,stroke-width:1.5px,stroke-dasharray: 4 2;
  classDef usecase fill:#f8fafc,stroke:#334155,stroke-width:1px;
  class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10,UC11,UC12,UC13,UC14,UC15 usecase;
```

### Pembagian Aktor

| Aktor | Deskripsi | Akses |
|-------|-----------|-------|
| **Pengunjung** | User publik website | Lihat landing page, menu, paket, FAQ, dan trigger reservasi WhatsApp |
| **Admin** | Operasional harian (Aditya Roihansyah) | Login dashboard, kelola operasional menu (toggle stok, update harga, deskripsi, gambar), update FAQ dan jam cabang |
| **Owner** | Pemilik tiap cabang Tuku Ramen | Mewarisi seluruh akses Admin **+** add/delete menu, paket, cabang, dan manage admin users |

Owner adalah generalisasi dari Admin, artinya Owner dapat melakukan semua use case yang dimiliki Admin ditambah use case strategis (penambahan dan penghapusan data master serta manage akun admin). Pemisahan ini mengikuti prinsip *least privilege* untuk operasi destruktif (hapus menu, hapus cabang) yang berdampak luas pada data.

## Diagram Alur Sistem

```mermaid
flowchart TD
  Visitor["Pengunjung website"] --> Landing["Landing page"]
  Landing --> PublicMenu["Halaman menu publik"]
  Landing --> Reservation["Link reservasi WhatsApp"]
  PublicMenu --> BranchFilter["Pilih cabang"]
  BranchFilter --> MenuData["Data menu dari Supabase"]

  Admin["Admin Tuku Ramen"] --> Login["/admin/login"]
  Login --> Auth["Supabase Auth"]
  Auth --> AdminCheck["Cek admin_users"]
  AdminCheck --> Dashboard["Admin dashboard"]
  Dashboard --> CrudMenu["CRUD menu per cabang"]
  Dashboard --> CrudBranch["CRUD cabang"]
  Dashboard --> CrudPackage["CRUD paket"]
  Dashboard --> CrudFaq["CRUD FAQ"]
  CrudMenu --> Storage["Upload gambar ke Storage menu-images"]

  MenuData --> Database["Supabase PostgreSQL"]
  CrudMenu --> Database
  CrudBranch --> Database
  CrudPackage --> Database
  CrudFaq --> Database
  Storage --> PublicImage["Public image URL"]
  PublicImage --> PublicMenu
```

## Sequence Diagram

```mermaid
sequenceDiagram
  actor Visitor as Pengunjung
  participant Web as Next.js Public Website
  participant DB as Supabase Database
  participant WA as WhatsApp

  Visitor->>Web: Buka landing page
  Web-->>Visitor: Tampilkan brand, menu pilihan, cabang, FAQ
  Visitor->>Web: Klik Lihat Menu
  Web->>DB: Ambil branches, categories, menu_items
  DB-->>Web: Data menu sesuai cabang
  Web-->>Visitor: Tampilkan menu dan filter cabang
  Visitor->>Web: Klik reservasi cabang
  Web-->>WA: Buka link WhatsApp cabang
```

```mermaid
sequenceDiagram
  actor Admin as Admin
  participant AdminWeb as Next.js Admin Dashboard
  participant Auth as Supabase Auth
  participant DB as Supabase Database
  participant Storage as Supabase Storage

  Admin->>AdminWeb: Login email dan password
  AdminWeb->>Auth: signInWithPassword
  Auth-->>AdminWeb: Session user
  AdminWeb->>DB: Cek user di admin_users
  DB-->>AdminWeb: Admin valid
  AdminWeb-->>Admin: Tampilkan dashboard
  Admin->>AdminWeb: Tambah atau edit menu
  AdminWeb->>DB: Insert/update menu_items
  DB-->>AdminWeb: Menu tersimpan
  Admin->>AdminWeb: Upload gambar menu
  AdminWeb->>Storage: Upload ke bucket menu-images
  Storage-->>AdminWeb: Public image URL
  AdminWeb->>DB: Simpan image_url di menu_items
  DB-->>AdminWeb: Data menu terupdate
```

## Struktur Penting

```txt
src/app/(public)/page.tsx       Landing page
src/app/(public)/menu/page.tsx  Menu publik per cabang
src/app/admin/                  Admin dashboard
src/components/ui/              Komponen UI publik
src/lib/supabase/               Supabase client/server/proxy helper
src/lib/types/database.ts       Type dan fallback data
src/proxy.ts                    Proteksi route admin
supabase-schema.sql             Schema database awal
supabase-complete-menu-seed.sql Seed menu lengkap
supabase-production-admin-security.sql RLS admin allowlist
```

## Setup Development

Install dependency:

```bash
npm install
```

Buat file `.env.local` dari contoh:

```bash
cp .env.example .env.local
```

Isi dengan konfigurasi Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jalankan development server:

```bash
npm run dev
```

Script `dev` memakai webpack agar lebih ringan untuk laptop development. Kalau ingin mencoba Turbopack:

```bash
npm run dev:turbo
```

## Setup Supabase

Jalankan SQL berikut di Supabase SQL Editor sesuai kebutuhan:

1. `supabase-schema.sql` untuk membuat tabel dasar.
2. `supabase-complete-menu-seed.sql` untuk mengisi data menu, cabang, topping, dan paket.
3. `supabase-production-admin-security.sql` untuk policy RLS, tabel `admin_users`, dan storage policy. Sudah include kolom `role` (admin/owner) dan policy berbasis role.
4. `supabase-add-role-column.sql` (opsional) — hanya perlu dijalankan di project yang sudah memakai schema lama dan butuh migration kolom `role`.

Sebelum menjalankan file security, pastikan user admin sudah dibuat di Supabase Authentication. Default script memakai:

```sql
WHERE email = 'admin@tukuramen.com'
```

Ganti email tersebut jika akun admin development memakai email lain.

## Storage Gambar Menu

Bucket yang dipakai:

```txt
menu-images
```

Bucket ini harus public agar gambar menu dapat tampil di website. Policy upload/update/delete tetap dibatasi oleh `public.is_admin()` dari `supabase-production-admin-security.sql`.

## Keamanan

- `.env.local` dan semua file `.env*` tidak ikut commit.
- Hanya `.env.example` yang boleh masuk repository.
- Admin dashboard tidak cukup hanya login; user juga harus ada di tabel `admin_users`.
- RLS public hanya mengizinkan read untuk data website.
- Write access untuk tabel admin dan storage dibatasi ke admin allowlist.
- Jangan commit service role key Supabase ke frontend atau repository.

## Perintah Validasi

```bash
npm run lint
npm run build
```

Saat ini lint dapat menampilkan warning Next.js untuk penggunaan `<img>` pada preview gambar menu. Warning tersebut tidak memblokir build.

## Deployment

Untuk deployment ke Vercel atau hosting Next.js lain:

1. Set environment variable `NEXT_PUBLIC_SUPABASE_URL`.
2. Set environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Pastikan SQL schema, seed, security policy, dan bucket `menu-images` sudah tersedia di Supabase.
4. Jalankan build production:

```bash
npm run build
```
