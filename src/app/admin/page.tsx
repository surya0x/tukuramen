'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, MapPin, Package, UtensilsCrossed } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const statConfig = [
  { key: 'menu', label: 'Total Menu', icon: UtensilsCrossed, href: '/admin/menu', color: '#9b291b', bg: 'rgba(155,41,27,0.08)' },
  { key: 'packages', label: 'Total Paket', icon: Package, href: '/admin/packages', color: '#f4bd25', bg: 'rgba(244,189,37,0.12)' },
  { key: 'branches', label: 'Cabang', icon: MapPin, href: '/admin/branches', color: '#15803d', bg: 'rgba(21,128,61,0.08)' },
  { key: 'faqs', label: 'FAQ', icon: HelpCircle, href: '/admin/faqs', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
] as const;

type StatKey = typeof statConfig[number]['key'];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<StatKey, number>>({ menu: 0, packages: 0, branches: 0, faqs: 0 });
  const [error, setError] = useState<string | null>(null);

  async function loadCounts() {
    const [menu, packages, branches, faqs] = await Promise.all([
      supabase.from('menu_items').select('id', { count: 'exact', head: true }),
      supabase.from('packages').select('id', { count: 'exact', head: true }),
      supabase.from('branches').select('id', { count: 'exact', head: true }),
      supabase.from('faqs').select('id', { count: 'exact', head: true }),
    ]);

    const firstError = menu.error || packages.error || branches.error || faqs.error;
    if (firstError) {
      setError(firstError.message);
      return;
    }

    setCounts({
      menu: menu.count || 0,
      packages: packages.count || 0,
      branches: branches.count || 0,
      faqs: faqs.count || 0,
    });
  }

  useEffect(() => {
    const task = window.setTimeout(() => {
      void loadCounts();
    }, 0);
    return () => window.clearTimeout(task);

  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2d2420', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#7a6e63', fontSize: '0.9rem' }}>Selamat datang di panel admin Tuku Ramen</p>
      </div>

      {error && <div style={{ background: 'rgba(154,33,23,0.08)', border: '1px solid rgba(154,33,23,0.18)', color: '#9b291b', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

      <div className="grid-4-col" style={{ marginBottom: '2rem' }}>
        {statConfig.map(({ key, label, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none', background: '#fff', border: '1px solid #e5e1d8', borderRadius: '1rem', padding: '1.5rem', transition: 'all 0.3s', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '0.5rem', background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span style={{ color: '#7a6e63', fontSize: '0.85rem' }}>{label}</span>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#2d2420' }}>{counts[key]}</p>
          </Link>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '1rem', padding: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2d2420', marginBottom: '1.25rem' }}>Panduan Cepat</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#7a6e63' }}>
          <p><strong style={{ color: '#2d2420' }}>Menu</strong> - Kelola menu per cabang, gambar menu, toggle sold out, edit harga dan deskripsi</p>
          <p><strong style={{ color: '#2d2420' }}>Paket</strong> - Kelola paket hemat dan promo</p>
          <p><strong style={{ color: '#2d2420' }}>Cabang</strong> - Tambah atau update jam operasional, alamat, Maps, dan WhatsApp reservasi</p>
          <p><strong style={{ color: '#2d2420' }}>FAQ</strong> - Tambah atau edit pertanyaan umum pelanggan</p>
        </div>
        
      </div>
    </div>
  );
}
