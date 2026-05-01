'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { UtensilsCrossed, Package, MapPin, HelpCircle, LayoutDashboard, LogOut, ChevronLeft, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/packages', label: 'Paket', icon: Package },
  { href: '/admin/branches', label: 'Cabang', icon: MapPin },
  { href: '/admin/faqs', label: 'FAQ', icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      {/* CSS for responsive admin layout */}
      <style>{`
        .admin-sidebar-desktop {
          display: none;
        }
        .admin-topbar {
          display: flex;
        }
        .admin-main {
          margin-left: 0;
        }
        .admin-main-padding {
          padding: 1rem;
        }
        @media (min-width: 1024px) {
          .admin-sidebar-desktop {
            display: flex;
          }
          .admin-topbar {
            display: none;
          }
          .admin-main {
            margin-left: 260px;
          }
          .admin-main-padding {
            padding: 2rem 2.5rem;
          }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f6f0' }}>

        {/* Desktop Sidebar - hidden on mobile via CSS */}
        <aside className="admin-sidebar-desktop" style={{
          width: '260px', background: '#1a1210', flexDirection: 'column',
          position: 'fixed', height: '100vh', zIndex: 40,
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Image src="/tukuramen.svg" alt="Tuku Ramen" width={24} height={24} style={{ filter: 'invert(1)' }} />
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.8rem', color: '#fff' }}>TUKU RAMEN</p>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Admin Panel</p>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sidebarLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none',
                  background: isActive ? 'rgba(154,33,23,0.15)' : 'transparent',
                  color: isActive ? '#e05550' : 'rgba(255,255,255,0.5)',
                }}>
                  <Icon size={18} />{label}
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', color: 'rgba(255,255,255,0.5)' }}>
              <ChevronLeft size={18} /> Kembali ke Website
            </Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', color: '#e05550', width: '100%', textAlign: 'left' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Mobile Overlay Sidebar */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
            <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px', background: '#1a1210', display: 'flex', flexDirection: 'column', zIndex: 60, boxShadow: '4px 0 20px rgba(0,0,0,0.3)' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Image src="/tukuramen.svg" alt="Tuku Ramen" width={24} height={24} style={{ filter: 'invert(1)' }} />
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.8rem', color: '#fff' }}>TUKU RAMEN</p>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Admin Panel</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  <X size={20} />
                </button>
              </div>
              <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {sidebarLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link key={href} href={href} onClick={() => setSidebarOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
                      background: isActive ? 'rgba(154,33,23,0.15)' : 'transparent',
                      color: isActive ? '#e05550' : 'rgba(255,255,255,0.5)',
                    }}>
                      <Icon size={18} />{label}
                    </Link>
                  );
                })}
              </nav>
              <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', color: 'rgba(255,255,255,0.5)' }}>
                  <ChevronLeft size={18} /> Kembali ke Website
                </Link>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', color: '#e05550', width: '100%', textAlign: 'left' }}>
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="admin-main" style={{ flex: 1 }}>
          {/* Mobile Top Bar */}
          <div className="admin-topbar" style={{
            position: 'sticky', top: 0, zIndex: 30, background: '#fff',
            borderBottom: '1px solid #e5e1d8', padding: '0.75rem 1rem',
            alignItems: 'center', gap: '0.75rem',
          }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2d2420', padding: '0.25rem' }}>
              <Menu size={24} />
            </button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.95rem', color: '#2d2420' }}>
              {sidebarLinks.find(l => l.href === pathname)?.label || 'Admin'}
            </span>
          </div>

          <div className="admin-main-padding">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
