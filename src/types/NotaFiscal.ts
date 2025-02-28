
export interface NotaFiscal {
  id?: string;
  razaoSocial: string;
  numeroNota: string;
  dataEmissao: Date;
  dataEnvioMensagem: Date;
  contato: string;
  telefone: string;
  status: 'pendente' | 'atrasado' | 'alerta-verde' | 'alerta-amarelo' | 'alerta-vermelho';
  created_at?: Date;
  updated_at?: Date;
}
