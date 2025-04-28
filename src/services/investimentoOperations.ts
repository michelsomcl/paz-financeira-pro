
import { Investimento, InvestimentoComCalculo } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { mapInvestimentoToDbInvestimento } from "@/utils/mapperFunctions";

export const salvarInvestimento = async (supabaseClient: typeof supabase, investimentos: InvestimentoComCalculo[], investimento: Investimento) => {
  try {
    // Convert to DB format
    const dbInvestimento = mapInvestimentoToDbInvestimento(investimento);
    
    // Salvar no Supabase
    const { error } = await supabaseClient
      .from('investimentos')
      .upsert([dbInvestimento], { onConflict: 'id' });
    
    if (error) {
      console.error("Erro ao salvar investimento no Supabase:", error);
      throw error;
    }
    
    // Backup no localStorage
    const investimentosSemCalculo = investimentos.map(({ calculo, ...rest }) => rest);
    localStorage.setItem("paz-financeira-investimentos", JSON.stringify(investimentosSemCalculo));
    console.log("Investimento salvo no Supabase e localStorage:", investimento);
    
    toast({
      title: "Investimento salvo",
      description: "O investimento foi salvo com sucesso."
    });
  } catch (error) {
    console.error("Erro ao salvar investimento:", error);
    toast({
      title: "Erro ao salvar",
      description: "Não foi possível salvar o investimento.",
      variant: "destructive"
    });
    throw error;
  }
};
