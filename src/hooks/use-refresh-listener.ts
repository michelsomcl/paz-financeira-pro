
import { useEffect } from "react";

export function useRefreshListener(onRefresh: () => Promise<void>) {
  useEffect(() => {
    const handleRefreshData = async () => {
      try {
        await onRefresh();
        console.log("Dados atualizados do Supabase");
      } catch (error) {
        console.error("Erro ao atualizar dados do Supabase:", error);
      }
    };

    window.addEventListener("refresh-data", handleRefreshData);
    return () => {
      window.removeEventListener("refresh-data", handleRefreshData);
    };
  }, [onRefresh]);
}
