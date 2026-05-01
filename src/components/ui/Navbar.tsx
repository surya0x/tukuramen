'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/#about', label: 'Tentang' },
  { href: '/#branches', label: 'Lokasi' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(26,18,16,0.95)', backdropFilter: 'blur(10px)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Image src="/tukuramen.svg" alt="Tuku Ramen" width={28} height={28} style={{ filter: 'invert(1)' }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.9rem', color: '#fff', letterSpacing: '0.05em' }}>
              TUKU RAMEN
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/#reservation" style={{
                background: '#9a2117', color: '#fff', padding: '0.5rem 1.25rem',
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px',
              }}>
                Book a Table
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: '#fff', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div style={{ background: '#1a1210', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} style={{
                color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', textDecoration: 'none',
                padding: '0.75rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                {link.label}
              </Link>
            ))}
            <Link href="/#reservation" onClick={() => setIsOpen(false)} style={{
              background: '#9a2117', color: '#fff', padding: '0.875rem', textAlign: 'center',
              fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', borderRadius: '4px',
              marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Book a Table
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
