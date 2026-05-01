import { Package } from 'lucide-react';

interface PackageCardProps {
  name: string;
  price: number;
  description: string;
  items: string[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export default function PackageCard({ name, price, description, items }: PackageCardProps) {
  return (
    <div className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-tuku-red-600/10 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-tuku-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-tuku-red-600/20 p-2 rounded-lg">
            <Package size={20} className="text-tuku-red-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-tuku-cream">{name}</h3>
        </div>

        <div className="font-display font-bold text-3xl text-tuku-gold mb-3">
          {formatPrice(price)}
        </div>

        <p className="text-tuku-cream/50 text-sm mb-4">{description}</p>

        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-tuku-cream/70">
              <span className="w-1.5 h-1.5 rounded-full bg-tuku-red-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
