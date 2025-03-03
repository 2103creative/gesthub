
import { supabase } from "@/integrations/supabase/client";
import type { NotaFiscal } from "../types/NotaFiscal";
import type { Database } from "../integrations/supabase/types";
import { toast } from "sonner";

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
    data_retirada: nota.data_retirada,
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
      toast.error("Erro ao carregar notas fiscais");
      throw error;
    }

    return data ? data.map(dbToNotaFiscal) : [];
  },

  async create(nota: NotaFiscal): Promise<NotaFiscal> {
    // Verificar se já existe uma nota com a mesma razão social e número
    const { data: existingNotas } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('razao_social', nota.razaoSocial)
      .eq('numero_nota', nota.numeroNota)
      .eq('retirado', false);
    
    // Se existir, use a data da primeira mensagem do registro mais antigo
    let primeiraMsg = nota.dataEnvioMensagem.toISOString();
    if (existingNotas && existingNotas.length > 0) {
      // Ordenar por data de criação para pegar o registro mais antigo
      const sortedNotas = [...existingNotas].sort((a, b) => 
        new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      primeiraMsg = sortedNotas[0].primeira_mensagem || sortedNotas[0].data_envio_mensagem;
    }
    
    nota.primeira_mensagem = primeiraMsg;

    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(notaFiscalToDB(nota))
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar nota fiscal:', error);
      if (error.code === '23514') {
        toast.error("Formato de telefone inválido. Use apenas números, parênteses, traços e espaços.");
      } else {
        toast.error("Erro ao criar nota fiscal");
      }
      throw error;
    }

    toast.success("Nota fiscal criada com sucesso");
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
      if (error.code === '23514') {
        toast.error("Formato de telefone inválido. Use apenas números, parênteses, traços e espaços.");
      } else {
        toast.error("Erro ao atualizar nota fiscal");
      }
      throw error;
    }

    toast.success("Nota fiscal atualizada com sucesso");
    return dbToNotaFiscal(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir nota fiscal:', error);
      toast.error("Erro ao excluir nota fiscal");
      throw error;
    }

    toast.success("Nota fiscal excluída com sucesso");
  },

  async atualizarStatus(): Promise<void> {
    const { error } = await supabase
      .rpc('atualizar_status_notas');

    if (error) {
      console.error('Erro ao atualizar status das notas:', error);
      toast.error("Erro ao atualizar status das notas");
      throw error;
    }

    toast.success("Status das notas atualizado com sucesso");
  },

  async marcarRetirado(id: string): Promise<void> {
    const { error } = await supabase
      .from('notas_fiscais')
      .update({ 
        retirado: true,
        data_retirada: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao marcar nota como retirada:', error);
      toast.error("Erro ao marcar nota como retirada");
      throw error;
    }
    
    toast.success("Nota fiscal marcada como retirada");
  }
};
