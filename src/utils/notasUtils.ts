
export const formatarData = (data: Date) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getDiasPassados = (dataPrimeiraMensagem: Date | string) => {
  const dataInicial = new Date(dataPrimeiraMensagem);
  const hoje = new Date();
  
  // Calculando a diferença em milissegundos
  const diffTime = Math.abs(hoje.getTime() - dataInicial.getTime());
  // Convertendo para dias
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getStatusMessage = (status: string, dataPrimeiraMensagem?: Date | string) => {
  if (status === 'pendente' && dataPrimeiraMensagem) {
    const diasPassados = getDiasPassados(dataPrimeiraMensagem);
    const diasRestantes = 7 - diasPassados;
    
    if (diasPassados >= 6) {
      return `Atenção: 1 dia ou menos para expirar (${diasPassados} dias passados)`;
    } else if (diasPassados >= 3) {
      return `Atenção: ${diasRestantes} dias para expirar (${diasPassados} dias passados)`;
    } else {
      return `Em andamento: ${diasRestantes} dias restantes (${diasPassados} dias passados)`;
    }
  }
  
  switch (status) {
    case 'atrasado':
      return 'Prazo de retirada expirado';
    case 'alerta-vermelho':
      return 'Atenção: 2 dias ou menos para expirar';
    case 'alerta-amarelo':
      return 'Atenção: 3-4 dias para expirar';
    case 'alerta-verde':
      return 'Em andamento: 5-7 dias restantes';
    default:
      return '';
  }
};

export const getStatusStyle = (status: string, dataPrimeiraMensagem?: Date | string) => {
  if (status === 'pendente' && dataPrimeiraMensagem) {
    const diasPassados = getDiasPassados(dataPrimeiraMensagem);
    
    if (diasPassados >= 6) {
      return 'bg-red-50 text-red-600';
    } else if (diasPassados >= 3) {
      return 'bg-yellow-50 text-yellow-600';
    } else {
      return 'bg-green-50 text-green-600';
    }
  }
  
  switch (status) {
    case 'atrasado':
    case 'alerta-vermelho':
      return 'bg-red-50 text-red-600';
    case 'alerta-amarelo':
      return 'bg-yellow-50 text-yellow-600';
    case 'alerta-verde':
      return 'bg-green-50 text-green-600';
    default:
      return '';
  }
};
