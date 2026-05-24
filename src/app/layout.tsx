import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tukuramen.com';
const SITE_NAME = 'Tuku Ramen';
const DEFAULT_TITLE = 'Tuku Ramen — Ramen Halal Otentik Jepang di Ciputat & Pondok Ranji';
const DEFAULT_DESCRIPTION =
  'Tuku Ramen menyajikan ramen halal berkualitas tinggi dengan cita rasa otentik Jepang. Kunjungi outlet kami di Ciputat dan Pondok Ranji, Tangerang Selatan.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Tuku Ramen',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'ramen halal',
    'ramen halal ciputat',
    'ramen halal pondok ranji',
    'ramen halal tangerang selatan',
    'tuku ramen',
    'japanese food halal',
    'ramen jepang halal',
    'restoran jepang halal tangerang',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/NLT09426.webp',
        width: 1024,
        height: 683,
        alt: 'Tuku Ramen — Tori Paitan Ramen halal otentik Jepang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/NLT09426.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'food',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/tukuramen.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  );
}
