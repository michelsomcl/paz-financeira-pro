
// Re-export all functions from their respective modules
export { 
  carregarDadosSupabase, 
  carregarDadosLocalStorage 
} from "@/services/dataLoaders";

export {
  salvarCliente
} from "@/services/clienteOperations";

export {
  salvarInvestimento
} from "@/services/investimentoOperations";

export {
  mapDbClienteToCliente,
  mapDbInvestimentoToInvestimento,
  mapClienteToDbCliente,
  mapInvestimentoToDbInvestimento,
  safeCalculoRentabilidade
} from "@/utils/mapperFunctions";
