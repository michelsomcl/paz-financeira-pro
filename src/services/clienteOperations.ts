
import { Cliente } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { mapClienteToDbCliente } from "@/utils/mapperFunctions";

export const salvarCliente = async (supabaseClient: typeof supabase, clientes: Cliente[], cliente: Cliente) => {
  try {
    // Convert to DB format
    const dbCliente = mapClienteToDbCliente(cliente);
    
    // Salvar no Supabase
    const { error } = await supabaseClient
      .from('clientes')
      .upsert([dbCliente], { onConflict: 'id' });
    
    if (error) {
      console.error("Erro ao salvar cliente no Supabase:", error);
      throw error;
    }
    
    // Backup no localStorage
    localStorage.setItem("paz-financeira-clientes", JSON.stringify(clientes));
    console.log("Cliente salvo no Supabase e localStorage:", cliente);
    
    toast({
      title: "Cliente salvo",
      description: "O cliente foi salvo com sucesso."
    });
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    toast({
      title: "Erro ao salvar",
      description: "Não foi possível salvar o cliente.",
      variant: "destructive"
    });
    throw error;
  }
};
