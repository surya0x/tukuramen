import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tukuramen.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/menu`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Tambah halaman menu per cabang sebagai entry terpisah
  try {
    const supabase = await createClient();
    const { data: branches } = await supabase.from('branches').select('slug, created_at');
    if (branches?.length) {
      branches.forEach((branch) => {
        staticRoutes.push({
          url: `${SITE_URL}/menu?branch=${branch.slug}`,
          lastModified: branch.created_at ? new Date(branch.created_at) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch {
    // Sitemap tetap valid walau Supabase tidak terjangkau
  }

  return staticRoutes;
}
