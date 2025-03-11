
import type { NotaFiscal } from "../types/NotaFiscal";
import type { Database } from "../integrations/supabase/types";

type NotaFiscalDB = Database['public']['Tables']['notas_fiscais']['Row'];

// Converter do formato do banco para o formato do frontend
export const dbToNotaFiscal = (notaDB: NotaFiscalDB): NotaFiscal => {
  return {
    id: notaDB.id,
    razaoSocial: notaDB.razao_social,
    numeroNota: notaDB.numero_nota,
    dataEmissao: new Date(notaDB.data_emissao),
    dataEnvioMensagem: new Date(notaDB.data_envio_mensagem),
    primeira_mensagem: notaDB.primeira_mensagem || notaDB.data_envio_mensagem,
    contato: notaDB.contato,
    telefone: notaDB.telefone,
    status: notaDB.status,
    retirado: notaDB.retirado || false,
    data_retirada: notaDB.data_retirada,
    created_at: notaDB.created_at ? new Date(notaDB.created_at) : undefined,
    updated_at: notaDB.updated_at ? new Date(notaDB.updated_at) : undefined,
    mensagem_count: notaDB.mensagem_count ? Number(notaDB.mensagem_count) : undefined,
    mensagem: notaDB.mensagem,
  };
};

// Converter do formato do frontend para o formato do banco
export const notaFiscalToDB = (nota: NotaFiscal) => {
  return {
    razao_social: nota.razaoSocial,
    numero_nota: nota.numeroNota,
    data_emissao: nota.dataEmissao.toISOString(),
    data_envio_mensagem: nota.dataEnvioMensagem.toISOString(),
    primeira_mensagem: nota.primeira_mensagem ? 
      (typeof nota.primeira_mensagem === 'string' ? 
        nota.primeira_mensagem : 
        nota.primeira_mensagem.toISOString()
      ) : 
      nota.dataEnvioMensagem.toISOString(),
    contato: nota.contato,
    telefone: nota.telefone,
    status: nota.status,
    retirado: nota.retirado || false,
    data_retirada: nota.data_retirada ? 
      (typeof nota.data_retirada === 'string' ? 
        nota.data_retirada : 
        nota.data_retirada.toISOString()
      ) : 
      null,
    mensagem_count: nota.mensagem_count,
    mensagem: nota.mensagem,
  };
};
