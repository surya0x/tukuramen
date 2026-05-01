'use client';

import { useState } from 'react';
import { Flame } from 'lucide-react';
import { SPICY_LEVELS } from '@/lib/types/database';

interface MenuCardProps {
  name: string;
  description: string | null;
  price: number;
  imageUrl?: string | null;
  isSpicy: boolean;
  isAvailable: boolean;
}

export default function MenuCard({ name, description, price, imageUrl, isSpicy, isAvailable }: MenuCardProps) {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const extraPrice = isSpicy ? (SPICY_LEVELS.find(l => l.level === selectedLevel)?.extra || 0) : 0;
  const totalPrice = price + extraPrice;

  return (
    <div className="card" style={{ opacity: isAvailable ? 1 : 0.5 }}>
      {/* Image */}
      <div style={{ position: 'relative', height: '12rem', background: 'linear-gradient(135deg, #faf8f0, #f0ece0)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.5rem' }}>🍜</span>
        )}
        {!isAvailable && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: '#9a2117', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sold Out</span>
          </div>
        )}
        {isSpicy && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: '#9a2117', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Flame size={11} /> Spicy
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1.1rem', color: '#2d2420' }}>{name}</h3>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#9a2117', fontSize: '1.1rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
            {(totalPrice / 1000).toFixed(0)}k
          </span>
        </div>

        {description && (
          <p style={{ color: '#7a6e63', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</p>
        )}

        {isSpicy && isAvailable && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e1d8' }}>
            <p style={{ fontSize: '0.65rem', color: '#998e83', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Tingkat Pedas</p>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {SPICY_LEVELS.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setSelectedLevel(level.level)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.375rem 0.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s',
                    background: selectedLevel === level.level ? '#9a2117' : '#f5f0e8',
                    color: selectedLevel === level.level ? '#fff' : '#7a6e63',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1px' }}>
                    {level.level > 0 ? Array.from({ length: level.level }).map((_, i) => <Flame key={i} size={9} />) : <span>0</span>}
                  </div>
                  <div style={{ fontSize: '0.6rem', marginTop: '0.2rem', opacity: 0.7 }}>
                    {level.extra > 0 ? `+${level.extra / 1000}k` : 'Free'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
