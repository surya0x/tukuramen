import { MapPin, Clock, ExternalLink } from 'lucide-react';

interface BranchCardProps {
  name: string;
  address: string;
  hours: Record<string, string>;
  mapsLink?: string | null;
}

const dayNames: Record<string, string> = {
  mon: 'Senin', tue: 'Selasa', wed: 'Rabu', thu: 'Kamis',
  fri: 'Jumat', sat: 'Sabtu', sun: 'Minggu',
};

export default function BranchCard({ name, address, hours, mapsLink }: BranchCardProps) {
  return (
    <div className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-tuku-red-600/10 group">
      <h3 className="font-display font-bold text-xl text-tuku-cream mb-3 group-hover:text-tuku-red-400 transition-colors">
        {name}
      </h3>

      <div className="flex items-start gap-2 text-tuku-cream/60 mb-4">
        <MapPin size={16} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm">{address}</p>
      </div>

      <div className="flex items-start gap-2 text-tuku-cream/60 mb-4">
        <Clock size={16} className="flex-shrink-0 mt-0.5" />
        <div className="text-sm space-y-0.5">
          {Object.entries(hours).map(([day, time]) => (
            <div key={day} className="flex justify-between gap-4">
              <span className="text-tuku-cream/50">{dayNames[day] || day}</span>
              <span className="text-tuku-cream/80">{time}</span>
            </div>
          ))}
        </div>
      </div>

      {mapsLink && (
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-tuku-red-400 hover:text-tuku-red-300 text-sm font-medium transition-colors"
        >
          <ExternalLink size={14} />
          Buka di Google Maps
        </a>
      )}
    </div>
  );
}
