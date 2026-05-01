'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { Flame, Store } from 'lucide-react';
import CategoryTabs from '@/components/ui/CategoryTabs';
import HalalBadge from '@/components/ui/HalalBadge';
import MenuCard from '@/components/ui/MenuCard';
import { createClient } from '@/lib/supabase/client';
import { SPICY_LEVELS, TOPPINGS_SEED, type Branch, type Category } from '@/lib/types/database';

interface PublicMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_spicy: boolean;
  is_available: boolean;
  category?: Category | null;
  branch?: Branch | null;
}

const supabase = createClient();

const toppingGroups = TOPPINGS_SEED.reduce((acc, t) => {
  const key = t.price;
  if (!acc[key]) acc[key] = [];
  acc[key].push(t);
  return acc;
}, {} as Record<number, typeof TOPPINGS_SEED>);

export default function MenuPage({ searchParams }: { searchParams: Promise<{ branch?: string | string[] }> }) {
  const params = use(searchParams);
  const branchParam = Array.isArray(params.branch) ? params.branch[0] : params.branch;
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<PublicMenuItem[]>([]);
  const [activeBranch, setActiveBranch] = useState(branchParam || '');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [branchResult, categoryResult, menuResult] = await Promise.all([
      supabase.from('branches').select('*').order('name', { ascending: true }),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select('*, category:categories(*), branch:branches(*)')
        .eq('is_available', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    ]);

    if (branchResult.error || categoryResult.error || menuResult.error) {
      setError(branchResult.error?.message || categoryResult.error?.message || menuResult.error?.message || 'Gagal memuat menu.');
      setLoading(false);
      return;
    }

    const nextBranches = (branchResult.data || []) as Branch[];
    const nextCategories = ((categoryResult.data || []) as Category[]).filter(c => c.slug !== 'topping' && c.slug !== 'paket');
    const nextItems = (menuResult.data || []) as PublicMenuItem[];
    const requestedBranch = nextBranches.find(branch => branch.slug === branchParam);

    setBranches(nextBranches);
    setCategories(nextCategories);
    setItems(nextItems);
    setActiveBranch(current => requestedBranch?.slug || current || nextBranches[0]?.slug || '');
    setActiveCategory(current => current || nextCategories[0]?.name || '');
    setLoading(false);
  }, [branchParam]);

  useEffect(() => {
    const task = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(task);
  }, [loadData]);

  const categoryNames = useMemo(() => categories.map(c => c.name), [categories]);
  const activeBranchData = branches.find(branch => branch.slug === activeBranch);
  const filteredItems = items.filter(item => item.branch?.slug === activeBranch && item.category?.name === activeCategory);

  return (
    <div style={{ paddingTop: '5rem', paddingBottom: '6rem', background: '#fff', minHeight: '100vh' }}>
      <div className="section-container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <HalalBadge className="mb-6" />
          <h1 className="section-title" style={{ marginTop: '1.5rem' }}>
            Menu <em style={{ color: '#9b291b' }}>Kami</em>
          </h1>
          <div className="divider" />
          <p style={{ color: '#7a6e63', maxWidth: '32rem', margin: '1.5rem auto 0', fontSize: '0.95rem' }}>
            Pilih cabang untuk melihat daftar menu yang tersedia di outlet tersebut.
          </p>
        </div>

        {error && <div style={{ background: 'rgba(154,33,23,0.08)', border: '1px solid rgba(154,33,23,0.18)', color: '#9b291b', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
          {branches.map((branch) => {
            const isActive = activeBranch === branch.slug;
            return (
              <button key={branch.id} onClick={() => setActiveBranch(branch.slug)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left', background: isActive ? '#9b291b' : '#faf8f0', color: isActive ? '#fff' : '#2d2420', border: `1px solid ${isActive ? '#9b291b' : '#e5e1d8'}`, borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer', boxShadow: isActive ? '0 8px 20px rgba(154,33,23,0.16)' : 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Store size={18} />
                  <span>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{branch.name.replace('Tuku Ramen ', '')}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', opacity: isActive ? 0.85 : 0.65 }}>{branch.operating_hours?.mon}</span>
                  </span>
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{isActive ? 'Aktif' : 'Pilih'}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', overflowX: 'auto', padding: '0 0.5rem' }} className="scrollbar-hide">
          <CategoryTabs categories={categoryNames} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: '0.25rem' }}>{activeBranchData?.name.replace('Tuku Ramen ', '') || 'Menu'}</p>
          <p style={{ color: '#7a6e63', fontSize: '0.85rem' }}>{loading ? 'Memuat menu...' : `${filteredItems.length} menu dalam kategori ${activeCategory}`}</p>
        </div>

        <div className="grid-3-col" style={{ marginBottom: '5rem' }}>
          {filteredItems.map((item) => (
            <MenuCard key={item.id} name={item.name} description={item.description} price={item.price} imageUrl={item.image_url} isSpicy={item.is_spicy} isAvailable={item.is_available} />
          ))}
        </div>

        {!loading && filteredItems.length === 0 && (
          <div style={{ maxWidth: '560px', margin: '-3rem auto 5rem', textAlign: 'center', color: '#7a6e63', background: '#faf8f0', border: '1px solid #e5e1d8', borderRadius: '0.75rem', padding: '1.5rem' }}>
            Belum ada menu tersedia untuk cabang dan kategori ini.
          </div>
        )}

        <section style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label" style={{ color: '#f4bd25' }}>Tambahan</p>
            <h2 className="section-title">Additional <em>Toppings</em></h2>
            <div className="divider" />
          </div>
          <div className="grid-4-col" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {Object.entries(toppingGroups).sort(([a], [b]) => Number(a) - Number(b)).map(([price, toppings]) => (
              <div key={price} style={{ border: '1px solid #e5e1d8', borderRadius: '0.75rem', padding: '1.25rem', background: '#faf8f0' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#9b291b', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Rp {(Number(price) / 1000).toFixed(0)}k</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {toppings.map(t => <li key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#7a6e63' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(161,26,22,0.4)', flexShrink: 0 }} />{t.name}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ border: '1px solid #e5e1d8', borderRadius: '1rem', padding: '2rem', textAlign: 'center', background: '#faf8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Flame size={20} style={{ color: '#9b291b' }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2d2420' }}>Tingkat Kepedasan</h3>
            </div>
            <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Berlaku untuk semua Signature Ramen</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SPICY_LEVELS.map((l) => (
                <div key={l.level} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginBottom: '0.25rem' }}>
                    {l.level > 0 ? Array.from({ length: l.level }).map((_, i) => <Flame key={i} size={14} style={{ color: '#9b291b' }} />) : <span style={{ color: '#7a6e63', fontSize: '0.85rem' }}>0</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7a6e63', marginTop: '0.25rem' }}>{l.label}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9b291b', marginTop: '0.2rem' }}>{l.extra > 0 ? `+${l.extra / 1000}k` : 'Free'}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
