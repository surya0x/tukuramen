import type { Metadata } from 'next';

const TITLE = 'Menu — Ramen, Donburi & Paket Halal';
const DESCRIPTION =
  'Lihat menu lengkap Tuku Ramen mulai dari Signature Ramen, Variasi Ramen, Donburi, sides, sampai paket hemat. Pilih cabang Ciputat atau Pondok Ranji untuk lihat ketersediaan menu.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/menu',
    type: 'website',
    images: [
      {
        url: '/NLT09439.webp',
        width: 1024,
        height: 683,
        alt: 'Menu Tuku Ramen — Red Ramen halal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/NLT09439.webp'],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
