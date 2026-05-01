'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Login berhasil, tetapi sesi admin tidak ditemukan.');
      setLoading(false);
      return;
    }

    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      await supabase.auth.signOut();
      setError('Akun ini tidak terdaftar sebagai admin Tuku Ramen.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: '#f8f6f0' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image src="/tukuramen.svg" alt="Tuku Ramen" width={56} height={56} style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#2d2420' }}>Admin Login</h1>
          <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginTop: '0.5rem' }}>Masuk ke dashboard pengelolaan Tuku Ramen</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: '#fff', border: '1px solid #e5e1d8', borderRadius: '1rem', padding: '2rem' }}>
          {error && (
            <div style={{ background: 'rgba(161,26,22,0.06)', border: '1px solid rgba(161,26,22,0.15)', color: '#9a2117', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{error}</div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#2d2420', marginBottom: '0.5rem' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tukuramen.com" required
              style={{ width: '100%', background: '#faf8f0', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#2d2420', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', background: '#faf8f0', border: '1px solid #e5e1d8', borderRadius: '0.5rem', padding: '0.75rem 2.5rem 0.75rem 0.75rem', fontSize: '0.85rem', color: '#2d2420', outline: 'none' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#998e83' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#9a2117', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.6 : 1 }}>
            {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <><LogIn size={18} /> Masuk</>}
          </button>
        </form>
      </div>
    </div>
  );
}
