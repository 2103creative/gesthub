
export interface NotaFiscal {
  id?: string;
  razaoSocial: string;
  numeroNota: string;
  dataEmissao: Date;
  dataEnvioMensagem: Date;
  primeira_mensagem?: string | Date; // Data da primeira mensagem (para contagem de dias)
  contato: string;
  telefone: string;
  status: 'pendente' | 'atrasado' | 'alerta-verde' | 'alerta-amarelo' | 'alerta-vermelho';
  retirado?: boolean;
  data_retirada?: string | Date;
  created_at?: Date;
  updated_at?: Date;
}
