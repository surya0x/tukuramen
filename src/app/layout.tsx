import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tuku Ramen — Authentic Halal Japanese Ramen',
  description: 'Ramen halal berkualitas tinggi dengan cita rasa otentik Jepang. Tersedia di Ciputat dan Pondok Ranji, Tangerang Selatan.',
  keywords: ['ramen halal', 'ramen halal ciputat', 'ramen halal pondok ranji', 'tuku ramen', 'japanese food tangerang selatan'],
  openGraph: {
    title: 'Tuku Ramen — Authentic Halal Japanese Ramen',
    description: 'Ramen halal berkualitas tinggi dengan cita rasa otentik Jepang di Ciputat & Pondok Ranji.',
    type: 'website',
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
