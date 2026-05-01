import { ShieldCheck } from 'lucide-react';

export default function HalalBadge({ className = '' }: { className?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#15803d', color: '#fff', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }} className={className}>
      <ShieldCheck size={14} style={{ flexShrink: 0 }} />
      <span>100% Halal Indonesia</span>
    </div>
  );
}
