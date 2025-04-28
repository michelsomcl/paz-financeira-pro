
import { Cliente, InvestimentoComCalculo } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { mapDbClienteToCliente, mapDbInvestimentoToInvestimento, safeCalculoRentabilidade } from "@/utils/mapperFunctions";

export const carregarDadosSupabase = async () => {
  try {
    // Carregar clientes do Supabase
    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .select('*');

    if (clientesError) {
      console.error("Erro ao carregar clientes do Supabase:", clientesError);
      throw clientesError;
    }

    // Carregar investimentos do Supabase
    const { data: investimentosData, error: investimentosError } = await supabase
      .from('investimentos')
      .select('*');

    if (investimentosError) {
      console.error("Erro ao carregar investimentos do Supabase:", investimentosError);
      throw investimentosError;
    }

    // Processar investimentos para adicionar cálculos
    const clientes = clientesData.map(mapDbClienteToCliente);
    const investimentos = investimentosData.map(dbInv => {
      const inv = mapDbInvestimentoToInvestimento(dbInv);
      return {
        ...inv,
        calculo: safeCalculoRentabilidade(inv)
      };
    });

    return { clientes, investimentos };
  } catch (e) {
    console.error("Erro ao carregar dados do Supabase:", e);
    // Fallback para localStorage em caso de erro
    return carregarDadosLocalStorage();
  }
};

export const carregarDadosLocalStorage = () => {
  let clientes: Cliente[] = [];
  let investimentos: InvestimentoComCalculo[] = [];
  try {
    const storedClientes = localStorage.getItem("paz-financeira-clientes");
    const storedInvestimentos = localStorage.getItem("paz-financeira-investimentos");
    if (storedClientes) {
      clientes = JSON.parse(storedClientes);
    }
    if (storedInvestimentos) {
      const parsedInvestimentos = JSON.parse(storedInvestimentos);
      investimentos = parsedInvestimentos.map((inv: any) => ({
        ...inv,
        calculo: safeCalculoRentabilidade(inv)
      }));
    }
  } catch (e) {
    console.error("Erro ao carregar dados do localStorage:", e);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados salvos.",
      variant: "destructive"
    });
    clientes = [];
    investimentos = [];
  }
  return { clientes, investimentos };
};
