
import { supabase } from "@/integrations/supabase/client";
import type { NotaFiscal } from "../types/NotaFiscal";
import { notaFiscalToDB, dbToNotaFiscal } from "../utils/notasFiscaisConverter";
import { toast } from "sonner";

// This service handles write operations for notas fiscais
export const NotasFiscaisCommandService = {
  async create(nota: NotaFiscal): Promise<NotaFiscal> {
    // Verificar se já existe uma nota com a mesma razão social e número
    const { data: existingNotas } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('razao_social', nota.razaoSocial)
      .eq('numero_nota', nota.numeroNota)
      .eq('retirado', false);
    
    // Se existir e não temos uma primeira_mensagem definida,
    // use a data da primeira mensagem do registro mais antigo
    let primeiraMsg = nota.primeira_mensagem || nota.dataEnvioMensagem.toISOString();
    let msgCount = nota.mensagem_count || 1;
    
    if (!nota.primeira_mensagem && existingNotas && existingNotas.length > 0) {
      // Ordenar por data de criação para pegar o registro mais antigo
      const sortedNotas = [...existingNotas].sort((a, b) => 
        new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      
      // Usar a primeira mensagem do registro mais antigo
      primeiraMsg = sortedNotas[0].primeira_mensagem || sortedNotas[0].data_envio_mensagem;
      
      // Se não estamos reutilizando uma contagem existente, incrementar
      if (!nota.mensagem_count) {
        msgCount = sortedNotas.length + 1;
      }
    }
    
    // Apenas atualizar se não foi definido explicitamente
    if (!nota.primeira_mensagem) {
      nota.primeira_mensagem = primeiraMsg;
    }
    
    // Respeitar a contagem de mensagens passada ou usar a calculada
    nota.mensagem_count = msgCount;

    console.log('Criando nota com primeira_mensagem:', nota.primeira_mensagem);
    console.log('Contagem de mensagens:', nota.mensagem_count);

    const dbNota = notaFiscalToDB(nota);
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert(dbNota)
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
  }
};
