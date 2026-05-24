import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ChevronDown, Clock, ExternalLink, Flame, MapPin, MessageCircle, Store } from 'lucide-react';
import FAQAccordion from '@/components/ui/FAQAccordion';
import HalalBadge from '@/components/ui/HalalBadge';
import { createClient } from '@/lib/supabase/server';
import { BRANCH_MENU_SEED_DATA, BRANCHES_SEED, FAQS_SEED, PACKAGES_SEED, type Branch, type BranchSlug, type Package } from '@/lib/types/database';

const RED = '#9b291b';
const GOLD = '#f4bd25';
const WHITE = '#fdfdfd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Beranda',
  description:
    'Tuku Ramen — ramen halal otentik Jepang di Ciputat dan Pondok Ranji, Tangerang Selatan. Cek menu signature, paket hemat, jam operasional, dan reservasi via WhatsApp.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tuku Ramen — Ramen Halal Otentik Jepang',
    description:
      'Ramen halal berkualitas tinggi dengan cita rasa otentik Jepang. Tersedia di Ciputat dan Pondok Ranji, Tangerang Selatan.',
    url: '/',
    type: 'website',
  },
};
const defaultBranchSlug = BRANCHES_SEED[0].slug as BranchSlug;
const signatureItems = BRANCH_MENU_SEED_DATA[defaultBranchSlug]['signature-ramen'];
const variasiItems = BRANCH_MENU_SEED_DATA[defaultBranchSlug]['variasi-ramen'];

const dayNames: Record<string, string> = {
  mon: 'Senin', tue: 'Selasa', wed: 'Rabu', thu: 'Kamis',
  fri: 'Jumat', sat: 'Sabtu', sun: 'Minggu',
};

function getReservationLink(whatsapp: string | null) {
  return whatsapp || '#';
}

function shortBranchName(name: string) {
  return name.replace('Tuku Ramen ', '');
}

export default async function HomePage() {
  const supabase = await createClient();
  const [faqsResult, branchesResult, packagesResult] = await Promise.all([
    supabase.from('faqs').select('question, answer').order('sort_order', { ascending: true }),
    supabase.from('branches').select('*').order('name', { ascending: true }),
    supabase.from('packages').select('*').eq('is_available', true).order('sort_order', { ascending: true }),
  ]);

  const faqItems = faqsResult.data && faqsResult.data.length > 0 ? faqsResult.data : FAQS_SEED;
  const branches = (branchesResult.data && branchesResult.data.length > 0 ? branchesResult.data : BRANCHES_SEED) as Branch[];
  const packages = (packagesResult.data && packagesResult.data.length > 0 ? packagesResult.data : PACKAGES_SEED) as Package[];
  const homeDefaultSlug = branches[0]?.slug || defaultBranchSlug;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tukuramen.com';
  const restaurantJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Tuku Ramen',
    description:
      'Ramen halal otentik Jepang dengan dua cabang di Ciputat dan Pondok Ranji, Tangerang Selatan.',
    url: siteUrl,
    image: [`${siteUrl}/NLT09426.webp`, `${siteUrl}/NLT09439.webp`],
    servesCuisine: ['Japanese', 'Halal Ramen'],
    priceRange: 'Rp25.000 - Rp200.000',
    acceptsReservations: 'True',
    sameAs: [
      'https://www.instagram.com/tukuramen/',
      'https://www.tiktok.com/@tukuramen',
      'https://www.facebook.com/profile.php?id=100084079308777',
    ],
    location: branches.map((branch) => ({
      '@type': 'Place',
      name: branch.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: branch.address,
        addressRegion: 'Banten',
        addressCountry: 'ID',
      },
      telephone: branch.phone || branch.whatsapp,
    })),
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.slice(0, 10).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* ===== HERO ===== */}
      <section className="home-hero" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Image src="/pondokranji.webp" alt="Tuku Ramen Restaurant" fill style={{ objectFit: 'cover' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.58), rgba(0,0,0,0.35), rgba(0,0,0,0.68))' }} />
        <div className="home-hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem', maxWidth: '700px' }}>
          <p className="animate-fade-in home-hero-eyebrow" style={{ color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
            Authentic Halal Japanese Ramen
          </p>
          <h1 className="animate-fade-in-up home-hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: WHITE, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Perjalanan ke<br />
            <em style={{ color: GOLD }}>Jiwa Kuliner</em> Jepang
          </h1>
          <div className="animate-fade-in-up delay-200 home-hero-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#reservation" className="home-primary-action" style={{ background: RED, color: WHITE, padding: '0.875rem 2rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', borderRadius: '2px' }}>
              Reservasi Sekarang
            </a>
            <Link href={`/menu?branch=${homeDefaultSlug}`} className="home-secondary-action" style={{ border: '1px solid rgba(255,255,255,0.45)', color: WHITE, padding: '0.875rem 2rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', borderRadius: '2px' }}>
              Lihat Menu
            </Link>
          </div>
        </div>
        <div className="home-scroll-cue" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
          <ChevronDown size={24} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="home-section" style={{ padding: '6rem 0', background: WHITE }}>
        <div className="section-container">
          <div className="grid-2-col home-about-grid" style={{ alignItems: 'center' }}>
            <div>
              <p className="section-label">Tentang Kami</p>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                Menghadirkan Tradisi<br />
                <em style={{ color: RED, fontStyle: 'italic' }}>Ramen Jepang</em><br />
                ke Meja Anda
              </h2>
              <div className="divider" style={{ margin: '0 0 1.5rem 0' }} />
              <p style={{ color: '#7a6e63', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Tuku Ramen menghadirkan ramen halal berkualitas tinggi dengan cita rasa otentik Jepang.
                Kami berkomitmen menyajikan hidangan terbaik menggunakan bahan-bahan segar dan bumbu pilihan.
              </p>
              <p style={{ color: '#7a6e63', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Dengan dua cabang di Ciputat dan Pondok Ranji, kami siap menyajikan pengalaman kuliner
                Jepang halal yang tak terlupakan untuk Anda dan keluarga.
              </p>
              <HalalBadge />
            </div>

            <div className="home-image-mosaic" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <Image src="/NLT09426.webp" alt="Tori Paitan Ramen" width={300} height={400} style={{ width: '100%', height: '16rem', objectFit: 'cover' }} />
                </div>
                <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <Image src="/NLT09439.webp" alt="Red Ramen" width={300} height={200} style={{ width: '100%', height: '10rem', objectFit: 'cover' }} />
                </div>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <Image src="/ciputat.webp" alt="Interior Tuku Ramen Ciputat" width={300} height={500} style={{ width: '100%', height: '22rem', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MENU PREVIEW ===== */}
      <section className="home-section" style={{ padding: '6rem 0', background: '#fff8ed' }}>
        <div className="section-container-sm">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Menu Pilihan</p>
            <h2 className="section-title">Temukan Menu <em>Cabang</em></h2>
            <div className="divider" />
            <p className="home-section-copy" style={{ color: '#7a6e63', maxWidth: '36rem', margin: '1.25rem auto 0', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Setiap cabang dapat punya menu unik dan status ketersediaan sendiri. Pilih cabang untuk melihat menu lengkap outlet tujuan.
            </p>
          </div>

          <div className="card home-menu-card" style={{ padding: 0 }}>
            <div className="grid-menu-2col">
              <div className="home-menu-column" style={{ padding: '1.5rem', borderBottom: '1px solid #e5e1d8' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2d2420', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Signature Ramen <Flame size={16} style={{ color: RED }} />
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {signatureItems.map((item) => (
                    <div key={item.name} className="home-menu-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <h4 style={{ fontWeight: 600, color: '#2d2420', fontSize: '0.95rem' }}>{item.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#7a6e63', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                      </div>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: RED, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {(item.price / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="home-menu-column" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2d2420', marginBottom: '1.5rem' }}>
                  Variasi Ramen
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {variasiItems.map((item) => (
                    <div key={item.name} className="home-menu-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <h4 style={{ fontWeight: 600, color: '#2d2420', fontSize: '0.95rem' }}>{item.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#7a6e63', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                      </div>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: RED, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {(item.price / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-branch-menu-links" style={{ borderTop: '1px solid #e5e1d8', padding: '1.25rem', textAlign: 'center' }}>
              {branches.map((branch) => (
                <Link key={branch.slug} href={`/menu?branch=${branch.slug}`} className="home-branch-link">
                  <Store size={18} style={{ color: RED }} />
                  <span>
                    <strong>{shortBranchName(branch.name)}</strong>
                    <small>Lihat menu cabang</small>
                  </span>
                  <ArrowRight size={16} style={{ color: RED, flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PAKET HEMAT ===== */}
      <section className="home-section" style={{ padding: '6rem 0', background: WHITE }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label" style={{ color: GOLD }}>Hemat & Puas</p>
            <h2 className="section-title">Paket <em style={{ color: RED }}>Hemat</em></h2>
            <div className="divider" />
          </div>

          <div className="grid-3-col home-package-grid">
            {packages.map((pkg) => (
              <div key={pkg.name} className="card home-package-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2d2420', marginBottom: '0.5rem' }}>{pkg.name}</h3>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: RED, fontWeight: 700, marginBottom: '1rem' }}>
                  Rp {(pkg.price / 1000).toFixed(0)}k
                </p>
                <p style={{ color: '#7a6e63', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{pkg.description}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pkg.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#7a6e63' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: RED, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRANCHES ===== */}
      <section id="branches" className="home-section" style={{ padding: '6rem 0', background: '#fff8ed', scrollMarginTop: '4rem' }}>
        <div className="section-container-sm">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Kunjungi Kami</p>
            <h2 className="section-title">Lokasi <em>Cabang</em></h2>
            <div className="divider" />
          </div>

          <div className="grid-2-col home-branch-grid" style={{ gap: '1.5rem' }}>
            {branches.map((branch) => (
              <div key={branch.name} className="card home-branch-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', color: '#2d2420', marginBottom: '1.25rem' }}>{branch.name}</h3>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <MapPin size={16} style={{ color: RED, flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.85rem', color: '#7a6e63' }}>{branch.address}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <Clock size={16} style={{ color: RED, flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    {Object.entries(branch.operating_hours).map(([day, time]) => (
                      <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#998e83' }}>{dayNames[day]}</span>
                        <span style={{ color: '#2d2420', fontWeight: 500 }}>{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="home-branch-actions">
                  <Link href={`/menu?branch=${branch.slug}`}>Menu</Link>
                  <a href={getReservationLink(branch.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  {branch.maps_link && (
                    <a href={branch.maps_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #e5e1d8', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#2d2420', textDecoration: 'none', transition: 'all 0.2s' }}>
                      <MapPin size={14} style={{ color: RED }} />
                      Google Maps
                      <ExternalLink size={12} style={{ color: '#998e83' }} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className="gallery-grid home-gallery">
        {['/NLT09426.webp', '/ciputat.webp', '/NLT09439.webp', '/pondokranji.webp'].map((src, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
            <Image src={src} alt="Tuku Ramen" fill style={{ objectFit: 'cover', transition: 'transform 0.7s' }} className="hover:scale-110" />
          </div>
        ))}
      </section>

      {/* ===== RESERVATION ===== */}
      <section id="reservation" className="home-section" style={{ padding: '6rem 0', background: WHITE, scrollMarginTop: '4rem' }}>
        <div className="section-container-sm">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Pesan Sekarang</p>
            <h2 className="section-title">Reservasi via <em style={{ color: RED }}>WhatsApp</em></h2>
            <div className="divider" />
            <p className="home-section-copy" style={{ color: '#7a6e63', maxWidth: '32rem', margin: '1.25rem auto 0', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Pilih cabang yang ingin kamu kunjungi dan langsung hubungi kami via WhatsApp untuk reservasi meja.
            </p>
          </div>

          <div className="grid-2-col home-reservation-grid" style={{ gap: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
            {branches.map((branch) => (
              <a key={branch.name} href={getReservationLink(branch.whatsapp)} target="_blank" rel="noopener noreferrer" className="card home-whatsapp-card">
                <MessageCircle size={32} style={{ color: WHITE }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                    {shortBranchName(branch.name)}
                  </p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                    Tap untuk chat via WhatsApp
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* <p style={{ textAlign: 'center', color: '#998e83', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            Ciputat: 10:30 - 23:00 | Pondok Ranji: 16:00 - 23:00
          </p> */}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="home-section" style={{ padding: '6rem 0', background: '#fff8ed', scrollMarginTop: '4rem' }}>
        <div className="section-container-xs">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Pertanyaan Umum</p>
            <h2 className="section-title">FAQ</h2>
            <div className="divider" />
          </div>
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      <div className="home-mobile-sticky">
        <Link href={`/menu?branch=${homeDefaultSlug}`}>
          <Store size={16} />
          Menu
        </Link>
        <a href="#reservation">
          <MessageCircle size={16} />
          Reservasi
        </a>
      </div>
    </>
  );
}
