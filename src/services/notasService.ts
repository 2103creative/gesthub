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
    mensagem_count: notaDB.mensagem_count,
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
  };
};

export const NotasService = {
  async getAll(): Promise<NotaFiscal[]> {
    // Using raw SQL to get the message count for each client
    const { data, error } = await supabase
      .rpc('get_notas_with_message_count');

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
    let msgCount = 1;
    
    if (existingNotas && existingNotas.length > 0) {
      // Ordenar por data de criação para pegar o registro mais antigo
      const sortedNotas = [...existingNotas].sort((a, b) => 
        new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      primeiraMsg = sortedNotas[0].primeira_mensagem || sortedNotas[0].data_envio_mensagem;
      
      // Incrementar o contador de mensagens
      msgCount = sortedNotas.length + 1;
    }
    
    nota.primeira_mensagem = primeiraMsg;
    nota.mensagem_count = msgCount;

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
  },

  async reenviarMensagem(nota: NotaFiscal): Promise<void> {
    try {
      // Clone the nota with a new date
      const novaData = new Date();
      const novaNota = {
        ...nota,
        dataEnvioMensagem: novaData,
        id: undefined,  // Remove ID so a new record is created
        mensagem_count: (nota.mensagem_count || 1) + 1, // Increment message count
      };
      
      // Keep the original primeira_mensagem if it exists
      if (nota.primeira_mensagem) {
        novaNota.primeira_mensagem = nota.primeira_mensagem;
      }

      // Create a new nota record
      await NotasService.create(novaNota);
      
      // Open WhatsApp with pre-filled message
      const mensagem = `Olá ${nota.contato}, passando para lembrar que a Nota Fiscal ${nota.numeroNota} da ${nota.razaoSocial} está disponível para retirada.`;
      const whatsappUrl = `https://wa.me/${nota.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success("Mensagem reenviada com sucesso");
    } catch (error) {
      console.error('Erro ao reenviar mensagem:', error);
      toast.error("Erro ao reenviar mensagem");
    }
  }
};
