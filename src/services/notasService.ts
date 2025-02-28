
import { supabase } from "@/integrations/supabase/client";
import type { NotaFiscal } from "../types/NotaFiscal";
import type { Database } from "../integrations/supabase/types";

type NotaFiscalDB = Database['public']['Tables']['notas_fiscais']['Row'];

// Converter do formato do banco para o formato do frontend
export const dbToNotaFiscal = (notaDB: NotaFiscalDB): NotaFiscal => {
  return {
    razaoSocial: notaDB.razao_social,
    numeroNota: notaDB.numero_nota,
    dataEmissao: new Date(notaDB.data_emissao),
    dataEnvioMensagem: new Date(notaDB.data_envio_mensagem),
    contato: notaDB.contato,
    telefone: notaDB.telefone,
    status: notaDB.status,
    created_at: notaDB.created_at ? new Date(notaDB.created_at) : undefined,
    updated_at: notaDB.updated_at ? new Date(notaDB.updated_at) : undefined,
  };
};

// Converter do formato do frontend para o formato do banco
export const notaFiscalToDB = (nota: NotaFiscal) => {
  return {
    razao_social: nota.razaoSocial,
    numero_nota: nota.numeroNota,
    data_emissao: nota.dataEmissao.toISOString(),
    data_envio_mensagem: nota.dataEnvioMensagem.toISOString(),
    contato: nota.contato,
    telefone: nota.telefone,
    status: nota.status,
  };
};

export const NotasService = {
  async getAll(): Promise<NotaFiscal[]> {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .order('data_envio_mensagem', { ascending: true });

    if (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      throw error;
    }

    return data ? data.map(dbToNotaFiscal) : [];
  },

  async create(nota: NotaFiscal): Promise<NotaFiscal> {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(notaFiscalToDB(nota))
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar nota fiscal:', error);
      throw error;
    }

    return dbToNotaFiscal(data);
  },

  async update(id: string, nota: Partial<NotaFiscal>): Promise<NotaFiscal> {
    const updates = notaFiscalToDB(nota as NotaFiscal);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar nota fiscal:', error);
      throw error;
    }

    return dbToNotaFiscal(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir nota fiscal:', error);
      throw error;
    }
  }
};
