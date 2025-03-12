
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

    if (!data) return [];

    // After getting data from RPC, fetch the complete notes data to ensure we have all fields
    const noteIds = data.map(item => item.id);
    
    // If we have notes, fetch the complete data including mensagem field
    if (noteIds.length > 0) {
      const { data: completeNotes, error: fetchError } = await supabase
        .from('notas_fiscais')
        .select('*')
        .in('id', noteIds);
        
      if (fetchError) {
        console.error('Erro ao buscar dados completos das notas:', fetchError);
        toast.error("Erro ao carregar dados completos das notas");
      }
      
      // Create a map of complete notes by id for quick lookup
      const notesMap = new Map();
      if (completeNotes) {
        completeNotes.forEach(note => {
          notesMap.set(note.id, note);
        });
      }
      
      // Map data with message count and combine with complete note data
      return data.map(item => {
        const completeNote = notesMap.get(item.id) || {};
        
        return {
          id: item.id,
          razaoSocial: item.razao_social,
          numeroNota: item.numero_nota,
          dataEmissao: new Date(item.data_emissao),
          dataEnvioMensagem: new Date(item.data_envio_mensagem),
          primeira_mensagem: item.primeira_mensagem || item.data_envio_mensagem,
          contato: item.contato,
          telefone: item.telefone,
          status: item.status as "pendente" | "atrasado" | "alerta-verde" | "alerta-amarelo" | "alerta-vermelho",
          retirado: item.retirado || false,
          data_retirada: item.data_retirada,
          created_at: item.created_at ? new Date(item.created_at) : undefined,
          updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
          mensagem_count: Number(item.mensagem_count) || 1,
          mensagem: completeNote.mensagem || '', // Get mensagem from the complete note data
        };
      });
    }
    
    return [];
  }
};
