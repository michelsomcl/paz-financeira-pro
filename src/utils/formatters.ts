
// Função para formatar valores monetários
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Máscara para campos de entrada monetária
export const currencyInputMask = (value: string): string => {
  // Remove tudo que não é dígito
  let onlyDigits = value.replace(/\D/g, '');
  
  // Converte para número e divide por 100 para obter o valor em reais
  let numberValue = parseInt(onlyDigits, 10) / 100;
  
  // Formata com separador de milhares e 2 casas decimais
  if (isNaN(numberValue)) {
    return '';
  }
  
  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Máscara para campos de entrada de percentual
export const percentageInputMask = (value: string): string => {
  // Permitir apenas dígitos e uma vírgula
  let cleanValue = value.replace(/[^\d,]/g, '');
  
  // Assegurar que existe apenas uma vírgula
  const commaCount = (cleanValue.match(/,/g) || []).length;
  if (commaCount > 1) {
    cleanValue = cleanValue.substring(0, cleanValue.lastIndexOf(',')) + 
      cleanValue.substring(cleanValue.lastIndexOf(',') + 1);
  }
  
  return cleanValue;
};

// Máscara para campos de data (no formato DD/MM/AA)
export const dateInputMask = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara DD/MM/AA
  if (cleanValue.length <= 2) {
    return cleanValue;
  } else if (cleanValue.length <= 4) {
    return `${cleanValue.substring(0, 2)}/${cleanValue.substring(2)}`;
  } else {
    return `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}/${cleanValue.substring(4, 6)}`;
  }
};

// Converte string formatada de volta para número
export const parseNumberFromCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove 'R$', espaços, pontos e substitui vírgula por ponto
  const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
  const parsedValue = parseFloat(cleanValue);
  
  return isNaN(parsedValue) ? 0 : parsedValue;
};

// Parse date string in format DD/MM/YY or DD/MM/YYYY to Date object
export const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Validate format with regex (DD/MM/YY or DD/MM/YYYY)
  const regex = /^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/;
  const match = dateStr.match(regex);
  
  if (!match) return null;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
  let year = parseInt(match[3], 10);
  
  // Handle 2-digit years (assume 20XX for years < 50, 19XX for years >= 50)
  if (year < 100) {
    year = year < 50 ? 2000 + year : 1900 + year;
  }
  
  // Validate date ranges
  if (day < 1 || day > 31 || month < 0 || month > 11) {
    return null;
  }
  
  const date = new Date(year, month, day);
  
  // Final validation (handles cases like 31/02/2023)
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
};

// Format percentage values
export const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '0,00%';
  }
  
  // Convert decimal to percentage (e.g., 0.0545 -> 5.45%)
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'percent'
  });
};

// Parse percentage string into a number
export const parsePercentageString = (percentStr: string): number => {
  if (!percentStr) return 0;
  
  // Remove % symbol and spaces, replace comma with dot
  const cleanValue = percentStr.replace(/[%\s]/g, '').replace(',', '.');
  const parsedValue = parseFloat(cleanValue) / 100; // Convert to decimal
  
  return isNaN(parsedValue) ? 0 : parsedValue;
};

// Safe parse function that includes validation
export const safeParseNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  
  // Handle string conversion
  const strValue = String(value).trim().replace(/[R$\s.]/g, '').replace(',', '.');
  const parsedValue = parseFloat(strValue);
  
  return isNaN(parsedValue) ? 0 : parsedValue;
};

// Validate investment data before calculating
export const validateInvestmentData = (
  valorAporte: number,
  dataAporte: string,
  dataVencimento: string,
): string | null => {
  if (isNaN(valorAporte) || valorAporte <= 0) {
    return 'Valor de aporte inválido';
  }
  
  const dataAporteObj = parseDateString(dataAporte);
  const dataVencimentoObj = parseDateString(dataVencimento);
  
  if (!dataAporteObj) {
    return 'Data de aporte inválida';
  }
  
  if (!dataVencimentoObj) {
    return 'Data de vencimento inválida';
  }
  
  if (dataAporteObj >= dataVencimentoObj) {
    return 'Data de vencimento deve ser posterior à data de aporte';
  }
  
  return null; // Validation passed
};
