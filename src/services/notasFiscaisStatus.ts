
import { supabase } from "@/integrations/supabase/client";
import type { NotaFiscal } from "../types/NotaFiscal";
import { toast } from "sonner";

// This service handles status operations for notas fiscais
export const NotasFiscaisStatusService = {
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
