'use client';

import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
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
      <div style={{ position: 'relative', background: '#fff', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '500px', margin: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2d2420' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#998e83' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editFaq, setEditFaq] = useState<FAQ | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FAQ | null>(null);
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');

  async function loadFaqs() {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
    if (loadError) setError(loadError.message);
    else setFaqs((data || []) as FAQ[]);
    setLoading(false);
  }

  useEffect(() => {
    const task = window.setTimeout(() => {
      void loadFaqs();
    }, 0);
    return () => window.clearTimeout(task);

  }, []);

  function resetForm() {
    setFormQ('');
    setFormA('');
  }

  function openEdit(faq: FAQ) {
    setFormQ(faq.question);
    setFormA(faq.answer);
    setEditFaq(faq);
  }

  async function handleAdd() {
    if (!formQ.trim() || !formA.trim() || saving) return;
    setSaving(true);
    setError(null);
    const { data, error: insertError } = await supabase.from('faqs').insert({ question: formQ.trim(), answer: formA.trim(), sort_order: faqs.length + 1 }).select('*').single();
    if (insertError) setError(insertError.message);
    else {
      setFaqs(prev => [...prev, data as FAQ]);
      setShowForm(false);
      resetForm();
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editFaq || !formQ.trim() || !formA.trim() || saving) return;
    setSaving(true);
    setError(null);
    const { data, error: updateError } = await supabase.from('faqs').update({ question: formQ.trim(), answer: formA.trim() }).eq('id', editFaq.id).select('*').single();
    if (updateError) setError(updateError.message);
    else {
      setFaqs(prev => prev.map(faq => faq.id === editFaq.id ? data as FAQ : faq));
      setEditFaq(null);
      resetForm();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteConfirm || saving) return;
    setSaving(true);
    setError(null);
    const { error: deleteError } = await supabase.from('faqs').delete().eq('id', deleteConfirm.id);
    if (deleteError) setError(deleteError.message);
    else {
      setFaqs(prev => prev.filter(faq => faq.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
    setSaving(false);
  }

  const renderFAQForm = (onSave: () => void, label: string) => (
    <>
      <div>
        <label style={labelStyle}>Pertanyaan *</label>
        <input value={formQ} onChange={e => setFormQ(e.target.value)} placeholder="Apakah Tuku Ramen halal?" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Jawaban *</label>
        <textarea value={formA} onChange={e => setFormA(e.target.value)} placeholder="Ya, Tuku Ramen 100% halal..." rows={4} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button onClick={() => { setShowForm(false); setEditFaq(null); resetForm(); }} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
        <button onClick={onSave} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>{saving ? 'Menyimpan...' : label}</button>
      </div>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2d2420' }}>FAQ</h1>
          <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginTop: '0.25rem' }}>{loading ? 'Memuat FAQ...' : `${faqs.length} FAQ tersimpan`}</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ background: '#9b291b', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Tambah FAQ
        </button>
      </div>

      {error && <div style={{ background: 'rgba(154,33,23,0.08)', border: '1px solid rgba(154,33,23,0.18)', color: '#9b291b', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {faqs.map((faq) => (
          <div key={faq.id} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, color: '#2d2420', fontSize: '0.95rem', marginBottom: '0.375rem' }}>{faq.question}</h3>
                <p style={{ color: '#7a6e63', fontSize: '0.85rem', lineHeight: 1.6 }}>{faq.answer}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                <button onClick={() => openEdit(faq)} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#7a6e63' }}><Edit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(faq)} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#faf8f0', border: '1px solid #e5e1d8', cursor: 'pointer', color: '#9b291b' }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title="Tambah FAQ">{renderFAQForm(() => void handleAdd(), 'Tambah')}</Modal>
      <Modal isOpen={!!editFaq} onClose={() => { setEditFaq(null); resetForm(); }} title="Edit FAQ">{renderFAQForm(() => void handleEdit(), 'Simpan')}</Modal>
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus FAQ?">
        <p style={{ color: '#7a6e63', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Yakin ingin menghapus FAQ ini?</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e1d8', background: '#fff', color: '#7a6e63', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          <button onClick={() => void handleDelete()} disabled={saving} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#9b291b', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>{saving ? 'Menghapus...' : 'Hapus'}</button>
        </div>
      </Modal>
    </div>
  );
}
