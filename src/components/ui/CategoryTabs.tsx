'use client';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="scrollbar-hide" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            whiteSpace: 'nowrap',
            padding: '0.625rem 1.5rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.3s',
            background: activeCategory === cat ? '#9a2117' : '#f0ece0',
            color: activeCategory === cat ? '#fff' : '#7a6e63',
            boxShadow: activeCategory === cat ? '0 2px 8px rgba(161,26,22,0.2)' : 'none',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
