import Image from 'next/image';
import Link from 'next/link';
import HalalBadge from './HalalBadge';

export default function Footer() {
  return (
    <footer style={{ background: '#1a1210', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Logo Center */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
          <Image src="/tukuramen.svg" alt="Tuku Ramen" width={48} height={48} style={{ filter: 'invert(1)', marginBottom: '1rem' }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>TUKU RAMEN</span>
          <HalalBadge />
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', textAlign: 'center' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>Jam Operasional</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>Ciputat</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>10:30 – 23:00</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>Pondok Ranji</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>16:00 – 23:00</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>Lokasi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>Ciputat</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Jl. Ir. H. Juanda, Tangerang Selatan</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>Pondok Ranji</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Jl. Pondok Ranji, Tangerang Selatan</p>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>Navigasi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'Menu', href: '/menu' },
                { label: 'Lokasi', href: '/#branches' },
                { label: 'FAQ', href: '/#faq' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.3s' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>© {new Date().getFullYear()} Tuku Ramen. All rights reserved.</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>Ramen Halal Ciputat & Pondok Ranji</p>
        </div>
      </div>
    </footer>
  );
}
