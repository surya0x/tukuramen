export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  branch_id?: string;
  is_spicy: boolean;
  spicy_levels: SpicyLevel[] | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  branch?: Branch;
}

export interface SpicyLevel {
  level: number;
  label: string;
  extra: number;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  operating_hours: OperatingHours;
  maps_link: string | null;
  phone: string | null;
  whatsapp: string | null;
  created_at: string;
}

export interface OperatingHours {
  [key: string]: string; // e.g. "mon": "11:00-21:00"
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  items: string[];
  is_available: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

// Menu data for seeding / fallback
export const CATEGORIES = [
  { name: 'Signature Ramen', slug: 'signature-ramen', sort_order: 1 },
  { name: 'Variasi Ramen', slug: 'variasi-ramen', sort_order: 2 },
  { name: 'Donburi', slug: 'donburi', sort_order: 3 },
  { name: 'Sides', slug: 'sides', sort_order: 4 },
  { name: 'Topping', slug: 'topping', sort_order: 5 },
  { name: 'Minuman', slug: 'minuman', sort_order: 6 },
  { name: 'Dessert', slug: 'dessert', sort_order: 7 },
  { name: 'Paket', slug: 'paket', sort_order: 8 },
] as const;

export const SPICY_LEVELS: SpicyLevel[] = [
  { level: 0, label: 'Tidak Pedas', extra: 0 },
  { level: 1, label: 'Level 1', extra: 3000 },
  { level: 2, label: 'Level 2', extra: 4000 },
  { level: 3, label: 'Level 3', extra: 5000 },
];

export const MENU_SEED_DATA = {
  'signature-ramen': [
    { name: 'Red Ramen', price: 34000, description: 'Ramen dengan topping telur, chicken chashu, jagung, pakcoy, dan kuah pedas gurih', is_spicy: true },
    { name: 'Tori Paitan Ramen', price: 34000, description: 'Ramen dengan topping chicken chashu, telur, jagung, daun bawang, nori, dan kaldu ayam yang kental', is_spicy: true },
  ],
  'variasi-ramen': [
    { name: 'Suppai Ramen', price: 34000, description: 'Ramen dengan topping telur, ayam cincang, nori, dengan cita rasa asam pedas', is_spicy: true },
    { name: 'Sukemen', price: 32000, description: 'Ramen dengan topping telur, chicken chashu, nori, dengan rasa asam pedas', is_spicy: true },
    { name: 'Red Yasai Ramen', price: 33000, description: 'Ramen dengan topping kol, tauge, chicken chashu, daun bawang, dan kuah pedas gurih', is_spicy: true },
    { name: 'Chicken Katsu Ramen', price: 33000, description: 'Ramen dengan topping chicken katsu, daun bawang, dan nori', is_spicy: false },
    { name: 'Mazesoba', price: 33000, description: 'Ramen kering dengan ayam cincang, chicken chashu, telur, nori, daun bawang, rasa manis asin gurih', is_spicy: false },
    { name: 'Maboh Tofu', price: 34000, description: 'Ramen dengan topping tahu, ayam cincang, rasa asin gurih, dan kuah kental', is_spicy: false },
    { name: 'Yakisoba', price: 32000, description: 'Ramen kering dengan topping kol, tauge, wortel, nira ayam, rasa manis asam gurih', is_spicy: false },
    { name: 'Curry Ramen / Rice', price: 34000, description: 'Kari dengan topping chicken katsu dan nori. Pilihan ramen atau nasi', is_spicy: false },
  ],
  donburi: [
    { name: 'Chahan', price: 24000, description: 'Nasi goreng khas Jepang dengan topping ayam, jagung, daun bawang, rasa asin gurih', is_spicy: false },
    { name: 'Chicken Yakiniku Don (Original)', price: 29000, description: 'Donburi dengan topping ayam, bawang bombay, jagung, kol, wortel, dan selada', is_spicy: false },
    { name: 'Chicken Yakiniku Don (Spicy)', price: 30000, description: 'Varian pedas dari Chicken Yakiniku Donburi', is_spicy: true },
    { name: 'Chicken Teriyaki Donburi', price: 29000, description: 'Nasi dengan topping ayam, jagung, kol, wortel dengan rasa manis gurih', is_spicy: false },
    { name: 'Chicken Katsu Donburi', price: 29000, description: 'Nasi dengan topping chicken katsu, jagung, kol, wortel, selada, rasa asin gurih', is_spicy: false },
  ],
  sides: [
    { name: 'Karage', price: 25000, description: 'Ayam goreng khas Jepang', is_spicy: false },
    { name: 'Yaki Gyoza', price: 25000, description: 'Gyoza panggang', is_spicy: false },
    { name: 'Age Gyoza', price: 24000, description: 'Gyoza goreng', is_spicy: false },
    { name: 'Tori Mayo', price: 27000, description: 'Ayam dengan saus mayones', is_spicy: false },
    { name: 'Ebi Furai', price: 27000, description: 'Udang goreng tepung', is_spicy: false },
  ],
  minuman: [
    { name: 'Sweet Tea (Hot)', price: 5000, description: 'Teh manis hangat', is_spicy: false },
    { name: 'Sweet Tea (Ice)', price: 6000, description: 'Es teh manis', is_spicy: false },
    { name: 'Ocha', price: 7000, description: 'Teh hijau Jepang - Free Refill', is_spicy: false },
    { name: 'Lemon Tea', price: 8000, description: 'Teh lemon segar', is_spicy: false },
    { name: 'Coca Cola', price: 10000, description: 'Coca Cola dingin', is_spicy: false },
    { name: 'Orange Juice', price: 12000, description: 'Jus jeruk segar', is_spicy: false },
    { name: 'Mineral Water', price: 5000, description: 'Air mineral', is_spicy: false },
  ],
  dessert: [
    { name: 'Putu Puding Tuku', price: 13000, description: 'Puding khas Tuku Ramen', is_spicy: false },
    { name: 'Esteler Tuku', price: 15000, description: 'Es teler khas Tuku Ramen', is_spicy: false },
  ],
};

export type BranchSlug = 'ciputat' | 'pondok-ranji';

export const BRANCH_SLUGS: BranchSlug[] = ['ciputat', 'pondok-ranji'];

export const BRANCH_SHORT_NAMES: Record<BranchSlug, string> = {
  ciputat: 'Ciputat',
  'pondok-ranji': 'Pondok Ranji',
};

export const BRANCH_MAP_LINKS: Record<BranchSlug, string> = {
  ciputat: 'https://maps.app.goo.gl/7GJkVvbRbFt3f2pe7',
  'pondok-ranji': 'https://maps.app.goo.gl/qJ88piw3moKapKRu5',
};

export const TOPPINGS_SEED = [
  { name: 'Tamago', price: 5000 },
  { name: 'Jagung', price: 5000 },
  { name: 'Tauge', price: 5000 },
  { name: 'Naruto Maki', price: 5000 },
  { name: 'Nasi', price: 5000 },
  { name: 'Pakcoy', price: 5000 },
  { name: 'Cabe Potong', price: 5000 },
  { name: 'Fish Roll', price: 6000 },
  { name: 'Chikuwa', price: 6000 },
  { name: 'Nori (3 lembar)', price: 6000 },
  { name: 'Scallop', price: 6000 },
  { name: 'Ramen (extra)', price: 7000 },
  { name: 'Ayam Cincang', price: 11000 },
  { name: 'Tori Chasiu', price: 11000 },
  { name: 'Chicken Katsu', price: 12000 },
  { name: 'Chicken Teriyaki', price: 12000 },
];

export const PACKAGES_SEED = [
  { name: 'Paket Hemat 1', price: 50000, description: 'Pilihan Signature Ramen + Gyoza (3 Pcs) + Es Teh Manis/Ocha/Mineral Water', items: ['Signature Ramen (pilihan)', 'Gyoza (3 Pcs)', 'Es Teh Manis/Ocha/Mineral Water'] },
  { name: 'Paket Hemat 2', price: 90000, description: '2 Pilihan Signature Ramen + Gyoza (3 Pcs) + 2 Es Teh Manis/Ocha/Mineral Water', items: ['2x Signature Ramen (pilihan)', 'Gyoza (3 Pcs)', '2x Es Teh Manis/Ocha/Mineral Water'] },
  { name: 'Paket Buka Sendiri', price: 52000, description: 'Signature Ramen + 1 Es Teler + 1 Teh Manis', items: ['Signature Ramen (pilihan)', 'Es Teler', 'Teh Manis'] },
  { name: 'Paket Ramadhan 2', price: 190000, description: '5 Porsi Ramen (bebas pilih) + 1 Porsi Gyoza + Free Takjil Kurma', items: ['5x Ramen (bebas pilih)', '1x Gyoza', 'Free Takjil Kurma'] },
  { name: 'Paket Ramadhan 1', price: 360000, description: '10 Porsi Ramen (bebas pilih) + 1 Porsi Gyoza + 1 Porsi Karage + Free Takjil Kurma', items: ['10x Ramen (bebas pilih)', '1x Gyoza', '1x Karage', 'Free Takjil Kurma'] },
];

export const BRANCHES_SEED = [
  {
    name: 'Tuku Ramen Ciputat',
    slug: 'ciputat',
    address: 'Jl. Ir. H. Juanda, Ciputat, Tangerang Selatan, Banten',
    operating_hours: { mon: '10:30-23:00', tue: '10:30-23:00', wed: '10:30-23:00', thu: '10:30-23:00', fri: '10:30-23:00', sat: '10:30-23:00', sun: '10:30-23:00' },
    maps_link: BRANCH_MAP_LINKS.ciputat,
    phone: null,
    whatsapp: 'https://bit.ly/reservasiciputat',
  },
  {
    name: 'Tuku Ramen Pondok Ranji',
    slug: 'pondok-ranji',
    address: 'Jl. Pondok Ranji, Ciputat Timur, Tangerang Selatan, Banten',
    operating_hours: { mon: '16:00-23:00', tue: '16:00-23:00', wed: '16:00-23:00', thu: '16:00-23:00', fri: '16:00-23:00', sat: '16:00-23:00', sun: '16:00-23:00' },
    maps_link: BRANCH_MAP_LINKS['pondok-ranji'],
    phone: null,
    whatsapp: 'https://bit.ly/reservasipondokranji',
  },
];

export const BRANCH_MENU_SEED_DATA: Record<BranchSlug, typeof MENU_SEED_DATA> = {
  ciputat: MENU_SEED_DATA,
  'pondok-ranji': MENU_SEED_DATA,
};

export function getMenuSeedDataByBranch(slug: string) {
  return BRANCH_MENU_SEED_DATA[slug as BranchSlug] || MENU_SEED_DATA;
}

export const FAQS_SEED = [
  { question: 'Apakah Tuku Ramen halal?', answer: 'Ya, Tuku Ramen 100% halal. Semua bahan baku kami dijamin halal dan tidak menggunakan babi atau alkohol dalam proses masak.', sort_order: 1 },
  { question: 'Apa menu paling populer?', answer: 'Red Ramen adalah signature dish kami yang paling digemari. Kuah pedas gurih dengan topping lengkap menjadi favorit pelanggan.', sort_order: 2 },
  { question: 'Apakah bisa pilih tingkat kepedasan?', answer: 'Ya! Untuk Signature Ramen, kami menyediakan 4 level: Level 0 (Tidak Pedas/Gratis), Level 1 (+3k), Level 2 (+4k), Level 3 (+5k).', sort_order: 3 },
  { question: 'Ada berapa cabang Tuku Ramen?', answer: 'Saat ini kami memiliki 2 cabang: Ciputat dan Pondok Ranji. Silakan cek jam operasional masing-masing cabang di website kami.', sort_order: 4 },
  { question: 'Apakah bisa pesan delivery?', answer: 'Ya, kami tersedia di GoFood dan GrabFood. Anda juga bisa datang langsung ke outlet kami.', sort_order: 5 },
  { question: 'Apakah ada paket hemat?', answer: 'Ada! Kami menyediakan Paket Hemat mulai dari 50k yang sudah termasuk ramen, gyoza, dan minuman.', sort_order: 6 },
];
