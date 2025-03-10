
import { supabase } from "@/integrations/supabase/client";
import type { NotaFiscal } from "../types/NotaFiscal";
import { toast } from "sonner";

// This service handles read operations for notas fiscais
export const NotasFiscaisQueryService = {
  async getAll(): Promise<NotaFiscal[]> {
    // Using custom RPC function to get notes with message count
    const { data, error } = await supabase
      .rpc('get_notas_with_message_count');

    if (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      toast.error("Erro ao carregar notas fiscais");
      throw error;
    }

    return data ? data.map(item => ({
      id: item.id,
      razaoSocial: item.razao_social,
      numeroNota: item.numero_nota,
      dataEmissao: new Date(item.data_emissao),
      dataEnvioMensagem: new Date(item.data_envio_mensagem),
      primeira_mensagem: item.primeira_mensagem || item.data_envio_mensagem,
      contato: item.contato,
      telefone: item.telefone,
      status: item.status as NotaFiscal['status'], // Cast to ensure correct type
      retirado: item.retirado || false,
      data_retirada: item.data_retirada,
      created_at: item.created_at ? new Date(item.created_at) : undefined,
      updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
      mensagem_count: Number(item.mensagem_count) || 1,
    })) : [];
  }
};
