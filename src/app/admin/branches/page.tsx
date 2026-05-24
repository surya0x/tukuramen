'use client';

import { useEffect, useState } from 'react';
import { Clock, Edit2, MapPin, Plus, Trash2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAdminRole } from '@/lib/hooks/useAdminRole';
import type { Branch, OperatingHours } from '@/lib/types/database';

type BranchForm = {
  name: string;
  slug: string;
  address: string;
  maps_link: string;
  phone: string;
  whatsapp: string;
  operating_hours: OperatingHours;
};

const supabase = createClient();
const dayNames: Record<string, string> = { mon: 'Senin', tue: 'Selasa', wed: 'Rabu', thu: 'Kamis', fri: 'Jumat', sat: 'Sabtu', sun: 'Minggu' };
const dayKeys = Object.keys(dayNames);
const inputStyle: React.CSSProperties = { width: '100%', background: '#faf8f0', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none', marginBottom: '1rem' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2d2420', marginBottom: '0.375rem' };

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: '1rem', padding: '1.5rem', width: '100%', maxWidth: '620px', margin: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2d2420' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#998e83' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function emptyForm(): BranchForm {
  return {
    name: '',
    slug: '',
    address: '',
    maps_link: '',
    phone: '',
    whatsapp: '',
    operating_hours: { mon: '10:30-23:00', tue: '10:30-23:00', wed: '10:30-23:00', thu: '10:30-23:00', fri: '10:30-23:00', sat: '10:30-23:00', sun: '10:30-23:00' },
  };
}

function slugify(value: string) {
  return value.toLowerCase().replace(/tuku ramen/g, '').trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminBranchesPage() {
  const { isOwner } = useAdminRole();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchForm>(emptyForm());

  async function loadBranches() {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase.from('branches').select('*').order('name', { ascending: true });
    if (loadError) setError(loadError.message);
    else setBranches((data || []) as Branch[]);
    setLoading(false);
  }

  useEffect(() => {
    const task = window.setTimeout(() => {
      void loadBranches();
    }, 0);
    return () => window.clearTimeout(task);

  }, []);

  function openAdd() {
    setForm(emptyForm());
    setShowAdd(true);
  }

  function openEdit(branch: Branch) {
    setForm({
      name: branch.name,
      slug: branch.slug,
      address: branch.address,
      maps_link: branch.maps_link || '',
      phone: branch.phone || '',
      whatsapp: branch.whatsapp || '',
      operating_hours: branch.operating_hours,
    });
    setEditBranch(branch);
  }

  function updateForm<K extends keyof BranchForm>(key: K, value: BranchForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function getPayload() {
    return {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      address: form.address.trim(),
      maps_link: form.maps_link.trim() || null,
      phone: form.phone.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      operating_hours: form.operating_hours,
    };
  }

  async function handleAdd() {
    if (!form.name.trim() || !form.address.trim() || saving) return;
    setSaving(true);
    setError(null);
    const { data, error: insertError } = await supabase.from('branches').insert(getPayload()).select('*').single();
    if (insertError) setError(insertError.message);
    else {
      setBranches(prev => [...prev, data as Branch]);
      setShowAdd(false);
      setForm(emptyForm());
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editBranch || !form.name.trim() || !form.address.trim() || saving) return;
    setSaving(true);
    setError(null);
    const { data, error: updateError } = await supabase.from('branches').update(getPayload()).eq('id', editBranch.id).select('*').single();
    if (updateError) setError(updateError.message);
    else {
      setBranches(prev => prev.map(branch => branch.id === editBranch.id ? data as Branch : branch));
      setEditBranch(null);
      setForm(emptyForm());
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteConfirm || saving) return;
    setSaving(true);
    setError(null);
    const { error: deleteError } = await supabase.from('branches').delete().eq('id', deleteConfirm.id);
    if (deleteError) setError(deleteError.message);
    else {
      setBranches(prev => prev.filter(branch => branch.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
    setSaving(false);
  }

  const renderBranchForm = (onSave: () => void, label: string) => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div><label style={labelStyle}>Nama Cabang *</label><input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Tuku Ramen Ciputat" style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Alamat *</label><textarea value={form.address} onChange={e => updateForm('address', e.target.value)} rows={3} placeholder="Alamat lengkap..." style={{ ...inputStyle, resize: 'none' }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label style={labelStyle}>Google Maps</label><input value={form.maps_link} onChange={e => updateForm('maps_link', e.target.value)} placeholder="https://maps.google.com/..." style={inputStyle} /></div>
        <div><label style={labelStyle}>WhatsApp Reservasi</label><input value={form.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)} placeholder="https://bit.ly/..." style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Telepon</label><input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="Opsional" style={inputStyle} /></div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Jam Operasional</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <input
            placeholder="Contoh: 10:30-23:00"
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  const allHours: Record<string, string> = {};
                  dayKeys.forEach(day => { allHours[day] = value; });
                  setForm(prev => ({ ...prev, operating_hours: allHours }));
                }
              }
            }}
            id="apply-all-hours"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('apply-all-hours') as HTMLInputElement;
              const value = input?.value?.trim();
              if (value) {
                const allHours: Record<string, string> = {};
                dayKeys.forEach(day => { allHours[day] = value; });
                setForm(prev => ({ ...prev, operating_hours: allHours }));
              }
            }}
            style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#faf8f0', color: '#2d2420', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Terapkan Semua
          </button>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#998e83', marginBottom: '0.75rem' }}>Isi jam lalu klik &quot;Terapkan Semua&quot; untuk mengubah semua hari, atau edit per hari di bawah.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {dayKeys.map(day => (
            <div key={day}>
              <label style={{ ...labelStyle, fontWeight: 500, color: '#7a6e63' }}>{dayNames[day]}</label>
              <input value={form.operating_hours[day] || ''} onChange={e => setForm(prev => ({ ...prev, operating_hours: { ...prev.operating_hours, [day]: e.target.value } }))} placeholder="10:30-23:00" style={{ ...inputStyle, marginBottom: 0 }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={() => { setShowAdd(false); setEditBranch(null); setForm(emptyForm()); }} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
        <button onClick={onSave} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>{saving ? 'Menyimpan...' : label}</button>
      </div>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2d2420' }}>Cabang</h1>
          <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginTop: '0.25rem' }}>{loading ? 'Memuat cabang...' : `${branches.length} cabang tersimpan`}</p>
        </div>
        <button onClick={openAdd} style={{ background: '#9b291b', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: isOwner ? 'flex' : 'none', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Tambah Cabang
        </button>
      </div>

      {error && <div style={{ background: 'rgba(154,33,23,0.08)', border: '1px solid rgba(154,33,23,0.18)', color: '#9b291b', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

      <div className="grid-2-col" style={{ gap: '1rem' }}>
        {branches.map((branch) => (
          <div key={branch.id} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '1rem', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2d2420' }}>{branch.name}</h3>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <button onClick={() => openEdit(branch)} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#7a6e63' }}><Edit2 size={14} /></button>
                {isOwner && (
                  <button onClick={() => setDeleteConfirm(branch)} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#9b291b' }}><Trash2 size={14} /></button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <MapPin size={16} style={{ color: '#9b291b', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: '#7a6e63' }}>{branch.address}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Clock size={16} style={{ color: '#9b291b', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                {Object.entries(branch.operating_hours).map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#998e83' }}>{dayNames[day]}</span>
                    <span style={{ color: '#2d2420', fontWeight: 500 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setForm(emptyForm()); }} title="Tambah Cabang">{renderBranchForm(() => void handleAdd(), 'Tambah')}</Modal>
      <Modal isOpen={!!editBranch} onClose={() => { setEditBranch(null); setForm(emptyForm()); }} title="Edit Cabang">{renderBranchForm(() => void handleEdit(), 'Simpan')}</Modal>
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Cabang?">
        <p style={{ color: '#7a6e63', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Yakin ingin menghapus <strong style={{ color: '#2d2420' }}>{deleteConfirm?.name}</strong>? Menu yang terhubung ke cabang ini juga akan ikut terhapus karena relasi database.</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          <button onClick={() => void handleDelete()} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>{saving ? 'Menghapus...' : 'Hapus'}</button>
        </div>
      </Modal>
    </div>
  );
}
