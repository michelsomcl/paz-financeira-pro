
import { v4 as uuidv4 } from "uuid";
import { Cliente } from "@/types";
import { toast } from "@/hooks/use-toast";
import { salvarCliente } from "@/services/clienteOperations";
import { supabase } from "@/integrations/supabase/client";

export function useClienteOperations(
  clientes: Cliente[], 
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>,
  investimentos: any[]
) {
  const getClienteById = (id: string): Cliente | undefined => 
    clientes.find((c) => c.id === id);

  const adicionarCliente = async (cliente: Omit<Cliente, "id">) => {
    try {
      const novoCliente: Cliente = { ...cliente, id: uuidv4() };
      const novosClientes = [...clientes, novoCliente];
      setClientes(novosClientes);
      
      await salvarCliente(supabase, novosClientes, novoCliente);
      
      toast({
        title: "Cliente cadastrado",
        description: `Cliente ${novoCliente.nome} foi adicionado com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao cadastrar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const excluirCliente = async (id: string) => {
    try {
      const temInvestimentos = investimentos.some(inv => inv.clienteId === id);
      if (temInvestimentos) {
        toast({
          title: "Não foi possível excluir",
          description: "Este cliente possui investimentos cadastrados. Exclua os investimentos primeiro.",
          variant: "destructive"
        });
        return;
      }
      
      // Excluir do Supabase
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erro ao excluir cliente do Supabase:", error);
        throw error;
      }
      
      const novosClientes = clientes.filter(cliente => cliente.id !== id);
      setClientes(novosClientes);
      
      // Atualizar o backup no localStorage
      localStorage.setItem('paz-financeira-clientes', JSON.stringify(novosClientes));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o cliente.",
        variant: "destructive"
      });
    }
  };

  return { getClienteById, adicionarCliente, excluirCliente };
}
