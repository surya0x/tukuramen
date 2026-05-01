'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {items.map((item, index) => (
        <div key={index} style={{ border: '1px solid #e5e1d8', borderRadius: '0.75rem', overflow: 'hidden', background: '#fff' }}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <span style={{ fontWeight: 600, color: '#2d2420', paddingRight: '1rem', fontSize: '0.95rem' }}>
              {item.question}
            </span>
            <ChevronDown
              size={18}
              style={{
                flexShrink: 0,
                color: openIndex === index ? '#9a2117' : '#7a6e63',
                transition: 'transform 0.3s',
                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
          <div style={{
            maxHeight: openIndex === index ? '200px' : '0',
            opacity: openIndex === index ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}>
            <p style={{ padding: '0 1.25rem 1.25rem', color: '#7a6e63', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
