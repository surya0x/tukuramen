'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type AdminRole = 'admin' | 'owner';

export function useAdminRole() {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      setRole((data?.role as AdminRole) || 'admin');
      setLoading(false);
    }

    void loadRole();
  }, []);

  return { role, loading, isOwner: role === 'owner' };
}
