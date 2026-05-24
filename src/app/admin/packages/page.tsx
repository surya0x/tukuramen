'use client';

import { useEffect, useState } from 'react';
import { Edit2, Plus, Save, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAdminRole } from '@/lib/hooks/useAdminRole';

interface PackageItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  items: string[];
  is_available: boolean;
  sort_order: number;
}

const supabase = createClient();
const inputStyle: React.CSSProperties = { width: '100%', background: '#faf8f0', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none', marginBottom: '1rem' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2d2420', marginBottom: '0.375rem' };

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: '1rem', padding: '1.5rem', width: '100%', maxWidth: '500px', margin: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2d2420' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#998e83' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminPackagesPage() {
  const { isOwner } = useAdminRole();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editPkg, setEditPkg] = useState<PackageItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<PackageItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formItems, setFormItems] = useState('');

  async function loadPackages() {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase.from('packages').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true });
    if (loadError) setError(loadError.message);
    else setPackages((data || []) as PackageItem[]);
    setLoading(false);
  }

  useEffect(() => {
    const task = window.setTimeout(() => {
      void loadPackages();
    }, 0);
    return () => window.clearTimeout(task);

  }, []);

  function resetForm() {
    setFormName('');
    setFormPrice('');
    setFormDesc('');
    setFormItems('');
  }

  function openEdit(pkg: PackageItem) {
    setFormName(pkg.name);
    setFormPrice((pkg.price / 1000).toString());
    setFormDesc(pkg.description || '');
    setFormItems(pkg.items.join('\n'));
    setEditPkg(pkg);
  }

  function getPayload() {
    return {
      name: formName.trim(),
      price: Math.round(Number(formPrice) * 1000),
      description: formDesc.trim() || null,
      items: formItems.split('\n').map(item => item.trim()).filter(Boolean),
    };
  }

  async function handleAdd() {
    if (!formName.trim() || !formPrice.trim() || saving) return;
    setSaving(true);
    setError(null);
    const { data, error: insertError } = await supabase.from('packages').insert({ ...getPayload(), is_available: true, sort_order: packages.length + 1 }).select('*').single();
    if (insertError) setError(insertError.message);
    else {
      setPackages(prev => [...prev, data as PackageItem]);
      setShowAdd(false);
      resetForm();
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editPkg || !formName.trim() || !formPrice.trim() || saving) return;
    setSaving(true);
    setError(null);
    const { data, error: updateError } = await supabase.from('packages').update(getPayload()).eq('id', editPkg.id).select('*').single();
    if (updateError) setError(updateError.message);
    else {
      setPackages(prev => prev.map(pkg => pkg.id === editPkg.id ? data as PackageItem : pkg));
      setEditPkg(null);
      resetForm();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteConfirm || saving) return;
    setSaving(true);
    setError(null);
    const { error: deleteError } = await supabase.from('packages').delete().eq('id', deleteConfirm.id);
    if (deleteError) setError(deleteError.message);
    else {
      setPackages(prev => prev.filter(pkg => pkg.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
    setSaving(false);
  }

  async function toggleAvailability(pkg: PackageItem) {
    const nextValue = !pkg.is_available;
    setPackages(prev => prev.map(item => item.id === pkg.id ? { ...item, is_available: nextValue } : item));
    const { error: updateError } = await supabase.from('packages').update({ is_available: nextValue }).eq('id', pkg.id);
    if (updateError) {
      setError(updateError.message);
      setPackages(prev => prev.map(item => item.id === pkg.id ? { ...item, is_available: pkg.is_available } : item));
    }
  }

  const renderPkgForm = (onSave: () => void, label: string) => (
    <>
      <div><label style={labelStyle}>Nama Paket *</label><input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Paket Hemat 1" style={inputStyle} /></div>
      <div><label style={labelStyle}>Harga (ribuan) *</label><input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="50" style={inputStyle} /></div>
      <div><label style={labelStyle}>Deskripsi</label><input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Deskripsi paket..." style={inputStyle} /></div>
      <div><label style={labelStyle}>Isi Paket (satu item per baris)</label><textarea value={formItems} onChange={e => setFormItems(e.target.value)} rows={4} placeholder={"Signature Ramen (pilihan)\nGyoza (3 Pcs)\nEs Teh Manis"} style={{ ...inputStyle, resize: 'none' }} /></div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={() => { setShowAdd(false); setEditPkg(null); resetForm(); }} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
        <button onClick={onSave} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}><Save size={16} /> {saving ? 'Menyimpan...' : label}</button>
      </div>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2d2420' }}>Paket</h1>
          <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginTop: '0.25rem' }}>{loading ? 'Memuat paket...' : `${packages.length} paket tersimpan`}</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }} style={{ background: '#9b291b', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: isOwner ? 'flex' : 'none', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Tambah Paket
        </button>
      </div>

      {error && <div style={{ background: 'rgba(154,33,23,0.08)', border: '1px solid rgba(154,33,23,0.18)', color: '#9b291b', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

      <div className="grid-2-col" style={{ gap: '1rem' }}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#2d2420' }}>{pkg.name}</h3>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#9b291b', fontWeight: 700, marginTop: '0.25rem' }}>Rp {(pkg.price / 1000).toFixed(0)}k</p>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <button onClick={() => openEdit(pkg)} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#7a6e63' }}><Edit2 size={14} /></button>
                {isOwner && (
                  <button onClick={() => setDeleteConfirm(pkg)} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#9b291b' }}><Trash2 size={14} /></button>
                )}
              </div>
            </div>
            <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginBottom: '1rem' }}>{pkg.description}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
              {pkg.items.map((item) => <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#7a6e63' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#9b291b', flexShrink: 0 }} />{item}</li>)}
            </ul>
            <button onClick={() => void toggleAvailability(pkg)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              {pkg.is_available ? <><ToggleRight size={20} style={{ color: '#15803d' }} /><span style={{ color: '#15803d', fontSize: '0.75rem', fontWeight: 600 }}>Available</span></> : <><ToggleLeft size={20} style={{ color: '#9b291b' }} /><span style={{ color: '#9b291b', fontSize: '0.75rem', fontWeight: 600 }}>Sold Out</span></>}
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); resetForm(); }} title="Tambah Paket">{renderPkgForm(() => void handleAdd(), 'Tambah')}</Modal>
      <Modal isOpen={!!editPkg} onClose={() => { setEditPkg(null); resetForm(); }} title="Edit Paket">{renderPkgForm(() => void handleEdit(), 'Simpan')}</Modal>
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Paket?">
        <p style={{ color: '#7a6e63', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Yakin ingin menghapus paket <strong style={{ color: '#2d2420' }}>{deleteConfirm?.name}</strong>?</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          <button onClick={() => void handleDelete()} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>{saving ? 'Menghapus...' : 'Hapus'}</button>
        </div>
      </Modal>
    </div>
  );
}
