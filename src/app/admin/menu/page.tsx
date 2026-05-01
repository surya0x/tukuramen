'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit2, Flame, ImagePlus, Plus, Save, Search, ToggleLeft, ToggleRight, Trash2, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Branch, Category } from '@/lib/types/database';

interface AdminMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  branch_id: string;
  is_spicy: boolean;
  is_available: boolean;
  sort_order: number;
  category?: Category | null;
  branch?: Branch | null;
}

type MenuPayload = {
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  branch_id: string;
  is_spicy: boolean;
  is_available?: boolean;
};

const supabase = createClient();
const inputStyle: React.CSSProperties = { width: '100%', background: '#faf8f0', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none', marginBottom: '1rem' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2d2420', marginBottom: '0.375rem' };

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: '1rem', padding: '1.5rem', width: '100%', maxWidth: '560px', margin: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2d2420' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#998e83', padding: '0.25rem' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function formatImagePath(itemId: string, fileName: string) {
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/(^-|-$)/g, '');
  return `${itemId}/${safeName || 'menu-image.jpg'}`;
}

function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message?: unknown }).message || fallback);
  }
  return fallback;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranch] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<AdminMenuItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminMenuItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formSpicy, setFormSpicy] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);

  const editableCategories = useMemo(() => categories.filter(c => c.slug !== 'topping' && c.slug !== 'paket'), [categories]);

  async function loadData() {
    setLoading(true);
    setError(null);

    const [categoryResult, branchResult, menuResult] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('branches').select('*').order('name', { ascending: true }),
      supabase
        .from('menu_items')
        .select('*, category:categories(*), branch:branches(*)')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    ]);

    if (categoryResult.error || branchResult.error || menuResult.error) {
      setError(categoryResult.error?.message || branchResult.error?.message || menuResult.error?.message || 'Gagal memuat data menu.');
      setLoading(false);
      return;
    }

    const nextCategories = (categoryResult.data || []) as Category[];
    const nextBranches = (branchResult.data || []) as Branch[];
    const nextItems = (menuResult.data || []) as AdminMenuItem[];

    setCategories(nextCategories);
    setBranches(nextBranches);
    setItems(nextItems);
    setActiveBranch(current => current || nextBranches[0]?.id || '');
    setFormCat(current => current || nextCategories.find(c => c.slug !== 'topping' && c.slug !== 'paket')?.id || '');
    setFormBranch(current => current || nextBranches[0]?.id || '');
    setLoading(false);
  }

  useEffect(() => {
    const task = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(task);

  }, []);

  const activeBranchData = branches.find(branch => branch.id === activeBranch);
  const activeBranchCount = items.filter(item => item.branch_id === activeBranch).length;
  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchBranch = item.branch_id === activeBranch;
    const matchCat = filterCat === 'all' || item.category_id === filterCat;
    return matchBranch && matchSearch && matchCat;
  });

  function resetForm(branchId = activeBranch) {
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCat(editableCategories[0]?.id || '');
    setFormBranch(branchId || branches[0]?.id || '');
    setFormSpicy(false);
    setFormImageUrl(null);
    setFormImageFile(null);
  }

  function openAdd() {
    resetForm(activeBranch);
    setShowAdd(true);
  }

  function openEdit(item: AdminMenuItem) {
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormPrice((item.price / 1000).toString());
    setFormCat(item.category_id);
    setFormBranch(item.branch_id);
    setFormSpicy(item.is_spicy);
    setFormImageUrl(item.image_url);
    setFormImageFile(null);
    setEditItem(item);
  }

  async function uploadMenuImage(itemId: string) {
    if (!formImageFile) return formImageUrl;

    const path = formatImagePath(itemId, formImageFile.name);
    const { error: uploadError } = await supabase.storage.from('menu-images').upload(path, formImageFile, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('menu-images').getPublicUrl(path);
    return data.publicUrl;
  }

  function getPayload(includeAvailability = false): MenuPayload {
    return {
      name: formName.trim(),
      description: formDesc.trim() || null,
      price: Math.round(Number(formPrice) * 1000),
      category_id: formCat,
      branch_id: formBranch,
      is_spicy: formSpicy,
      ...(includeAvailability ? { is_available: true } : {}),
    };
  }

  async function handleAdd() {
    if (!formName.trim() || !formPrice.trim() || !formCat || !formBranch || saving) return;
    setSaving(true);
    setError(null);

    try {
      const payload = getPayload(true);
      const { data, error: insertError } = await supabase
        .from('menu_items')
        .insert(payload)
        .select('*, category:categories(*), branch:branches(*)')
        .single();

      if (insertError) throw insertError;

      let savedItem = data as AdminMenuItem;
      const imageUrl = await uploadMenuImage(savedItem.id);

      if (imageUrl && imageUrl !== savedItem.image_url) {
        const { data: updated, error: updateError } = await supabase
          .from('menu_items')
          .update({ image_url: imageUrl })
          .eq('id', savedItem.id)
          .select('*, category:categories(*), branch:branches(*)')
          .single();

        if (updateError) throw updateError;
        savedItem = updated as AdminMenuItem;
      }

      setItems(prev => [...prev, savedItem]);
      setActiveBranch(savedItem.branch_id);
      setShowAdd(false);
      resetForm(savedItem.branch_id);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menambah menu.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editItem || !formName.trim() || !formPrice.trim() || !formCat || !formBranch || saving) return;
    setSaving(true);
    setError(null);

    try {
      const imageUrl = await uploadMenuImage(editItem.id);
      const { data, error: updateError } = await supabase
        .from('menu_items')
        .update({ ...getPayload(), image_url: imageUrl })
        .eq('id', editItem.id)
        .select('*, category:categories(*), branch:branches(*)')
        .single();

      if (updateError) throw updateError;

      const updatedItem = data as AdminMenuItem;
      setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
      setActiveBranch(updatedItem.branch_id);
      setEditItem(null);
      resetForm(updatedItem.branch_id);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan menu.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm || saving) return;
    setSaving(true);
    setError(null);

    const { error: deleteError } = await supabase.from('menu_items').delete().eq('id', deleteConfirm.id);
    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }

    setItems(prev => prev.filter(item => item.id !== deleteConfirm.id));
    setDeleteConfirm(null);
    setSaving(false);
  }

  async function toggleAvailability(item: AdminMenuItem) {
    setError(null);
    const nextValue = !item.is_available;
    setItems(prev => prev.map(current => current.id === item.id ? { ...current, is_available: nextValue } : current));

    const { error: updateError } = await supabase
      .from('menu_items')
      .update({ is_available: nextValue })
      .eq('id', item.id);

    if (updateError) {
      setError(updateError.message);
      setItems(prev => prev.map(current => current.id === item.id ? { ...current, is_available: item.is_available } : current));
    }
  }

  const renderMenuForm = (onSave: () => void, saveLabel: string) => (
    <>
      <div>
        <label style={labelStyle}>Nama Menu *</label>
        <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Red Ramen" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Deskripsi</label>
        <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Deskripsi menu..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Harga (dalam ribuan) *</label>
          <input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="34" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Kategori</label>
          <select value={formCat} onChange={e => setFormCat(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {editableCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Cabang</label>
        <select value={formBranch} onChange={e => setFormBranch(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Gambar Menu</label>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '9rem', border: '1px dashed #d7cbbd', borderRadius: '0.75rem', background: '#faf8f0', color: '#7a6e63', cursor: 'pointer', marginBottom: '1rem', overflow: 'hidden' }}>
          {formImageFile || formImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={formImageFile ? URL.createObjectURL(formImageFile) : formImageUrl || ''} alt="Preview menu" style={{ width: '100%', height: '9rem', objectFit: 'cover' }} />
          ) : (
            <>
              <ImagePlus size={22} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload gambar menu</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={e => setFormImageFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
        </label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input type="checkbox" id="spicy" checked={formSpicy} onChange={e => setFormSpicy(e.target.checked)} style={{ cursor: 'pointer' }} />
        <label htmlFor="spicy" style={{ fontSize: '0.85rem', color: '#2d2420', cursor: 'pointer' }}>Menu pedas (ada pilihan level)</label>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={() => { setShowAdd(false); setEditItem(null); resetForm(); }} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
        <button onClick={onSave} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}>
          {formImageFile ? <Upload size={16} /> : <Save size={16} />} {saving ? 'Menyimpan...' : saveLabel}
        </button>
      </div>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2d2420' }}>Menu</h1>
          <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {loading ? 'Memuat menu...' : `${activeBranchCount} item di ${activeBranchData?.name.replace('Tuku Ramen ', '') || 'cabang'} (${items.length} total semua cabang)`}
          </p>
        </div>
        <button onClick={openAdd} disabled={loading || !branches.length || !editableCategories.length} style={{ background: '#9b291b', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(154,33,23,0.08)', border: '1px solid rgba(154,33,23,0.18)', color: '#9b291b', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {branches.map((branch) => {
          const isActive = activeBranch === branch.id;
          const count = items.filter(item => item.branch_id === branch.id).length;
          return (
            <button key={branch.id} onClick={() => setActiveBranch(branch.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left', background: isActive ? '#9b291b' : '#fff', color: isActive ? '#fff' : '#2d2420', border: `1px solid ${isActive ? '#9b291b' : '#e5e1d8'}`, borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer' }}>
              <span>
                <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{branch.name.replace('Tuku Ramen ', '')}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: isActive ? 0.85 : 0.65 }}>{branch.operating_hours?.mon}</span>
              </span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{count} item</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#998e83' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari menu..." style={{ width: '100%', background: '#fff', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.625rem 0.75rem 0.625rem 2.5rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none' }} />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none', cursor: 'pointer' }}>
          <option value="all">Semua Kategori</option>
          {editableCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((item) => (
          <div key={item.id} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '0.65rem', overflow: 'hidden', background: '#faf8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.8rem' }}>🍜</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <p style={{ fontWeight: 600, color: item.is_available ? '#2d2420' : '#998e83', textDecoration: item.is_available ? 'none' : 'line-through', fontSize: '0.9rem' }}>{item.name}</p>
                  {item.is_spicy && <Flame size={13} style={{ color: '#9b291b' }} />}
                  <span style={{ background: '#faf8f0', color: '#7a6e63', padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem' }}>{item.category?.name || 'Tanpa kategori'}</span>
                </div>
                {item.description && <p style={{ fontSize: '0.78rem', color: '#998e83', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{item.description}</p>}
              </div>
              <p style={{ fontWeight: 600, color: '#2d2420', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Rp {(item.price / 1000).toFixed(0)}k</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid #f0ece0' }}>
              <button onClick={() => void toggleAvailability(item)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                {item.is_available ? <><ToggleRight size={20} style={{ color: '#15803d' }} /><span style={{ color: '#15803d', fontSize: '0.75rem', fontWeight: 600 }}>Available</span></> : <><ToggleLeft size={20} style={{ color: '#9b291b' }} /><span style={{ color: '#9b291b', fontSize: '0.75rem', fontWeight: 600 }}>Sold Out</span></>}
              </button>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <button onClick={() => openEdit(item)} style={{ padding: '0.375rem 0.625rem', borderRadius: '0.375rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#7a6e63', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Edit2 size={13} /> Edit</button>
                <button onClick={() => setDeleteConfirm(item)} style={{ padding: '0.375rem 0.625rem', borderRadius: '0.375rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#9b291b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Trash2 size={13} /> Hapus</button>
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', color: '#7a6e63', fontSize: '0.9rem' }}>
            Tidak ada menu yang cocok untuk cabang dan filter ini.
          </div>
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); resetForm(); }} title="Tambah Menu Baru">
        {renderMenuForm(() => void handleAdd(), 'Tambah')}
      </Modal>
      <Modal isOpen={!!editItem} onClose={() => { setEditItem(null); resetForm(); }} title="Edit Menu">
        {renderMenuForm(() => void handleEdit(), 'Simpan')}
      </Modal>
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Menu?">
        <p style={{ color: '#7a6e63', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Apakah kamu yakin ingin menghapus menu <strong style={{ color: '#2d2420' }}>{deleteConfirm?.name}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          <button onClick={() => void handleDelete()} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>{saving ? 'Menghapus...' : 'Hapus'}</button>
        </div>
      </Modal>
    </div>
  );
}
