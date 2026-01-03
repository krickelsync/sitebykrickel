import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export type DesignSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';
export type DesignCategory = 'Logo' | 'Clothing' | 'Packaging';

export interface DesignItem {
  id: string;
  title: string;
  category: DesignCategory;
  image_url: string;
  description: string | null;
  size: DesignSize;
  created_at: string;
  updated_at: string;
}

export const useDesignPortfolio = (category?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['design-portfolio', category],
    queryFn: async () => {
      let q = supabase
        .from('design_portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        q = q.eq('category', category);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as DesignItem[];
    }
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('design-portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'design_portfolio'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['design-portfolio'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};
