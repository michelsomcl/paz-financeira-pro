
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseRealtime(
  onDataChange: () => Promise<void>
) {
  useEffect(() => {
    const clientesSubscription = supabase
      .channel('clientes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, onDataChange)
      .subscribe();
      
    const investimentosSubscription = supabase
      .channel('investimentos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investimentos' }, onDataChange)
      .subscribe();
      
    return () => {
      supabase.removeChannel(clientesSubscription);
      supabase.removeChannel(investimentosSubscription);
    };
  }, [onDataChange]);
}
