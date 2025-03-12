
import type { NotaFiscal } from "../types/NotaFiscal";
import { NotasFiscaisCommandService } from "./notasFiscaisCommand";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// This service handles message operations for notas fiscais
export const NotasFiscaisMensagemService = {
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
      
      // IMPORTANT: Always preserve the original primeira_mensagem
      // This ensures day counting starts from the first message
      if (nota.primeira_mensagem) {
        // Ensure we're passing the first message date string as is
        novaNota.primeira_mensagem = typeof nota.primeira_mensagem === 'string' 
          ? nota.primeira_mensagem 
          : nota.primeira_mensagem.toISOString();
      } else {
        // If there's no primeira_mensagem (shouldn't happen), use the original dataEnvioMensagem
        // This preserves the original date for count purposes
        novaNota.primeira_mensagem = nota.dataEnvioMensagem.toISOString();
      }

      console.log('Reenviando mensagem com primeira_mensagem:', novaNota.primeira_mensagem);

      // Create a new nota record
      await NotasFiscaisCommandService.create(novaNota);
      
      // Open WhatsApp with new formatted message for resends
      const mensagem = `Olá, ${nota.contato}, tudo bem?\n\nMe chamo Lenoir e falo da Gplásticos.\nEstou entrando em contato para lembrar que a sua mercadoria está pronta para coleta.\n\n- Nota Fiscal Nº ${nota.numeroNota}\n- Horários para coleta: Segunda a Sexta, das 08h às 18h\n- Endereço: R. Demétrio Ângelo Tiburi, 1716 - Bela Vista, Caxias do Sul - RS, 95072-150\n- Google Maps: https://maps.app.goo.gl/3AnfMasiaeyn7jmj7\n\nQualquer dúvida, fico à disposição.`;
      
      const whatsappUrl = `https://wa.me/${nota.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success("Mensagem reenviada com sucesso");
    } catch (error) {
      console.error('Erro ao reenviar mensagem:', error);
      toast.error("Erro ao reenviar mensagem");
    }
  },
  
  // Generate WhatsApp URL without sending
  generateWhatsAppUrl(nota: NotaFiscal): string {
    // Using the same format for generating URLs without sending
    const mensagem = `Olá, ${nota.contato}, tudo bem?\n\nMe chamo Lenoir e falo da Gplásticos.\nEstou entrando em contato para lembrar que a sua mercadoria está pronta para coleta.\n\n- Nota Fiscal Nº ${nota.numeroNota}\n- Horários para coleta: Segunda a Sexta, das 08h às 18h\n- Endereço: R. Demétrio Ângelo Tiburi, 1716 - Bela Vista, Caxias do Sul - RS, 95072-150\n- Google Maps: https://maps.app.goo.gl/3AnfMasiaeyn7jmj7\n\nQualquer dúvida, fico à disposição.`;
    
    return `https://wa.me/${nota.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
  },

  // Add or update a message for a nota fiscal
  async updateMensagem(id: string, mensagem: string): Promise<void> {
    try {
      console.log('NotasFiscaisMensagemService - Salvando observação:', id, mensagem);
      
      // Direct database update to ensure the message is saved
      const { error } = await supabase
        .from('notas_fiscais')
        .update({ mensagem: mensagem }) // Explicitly use mensagem: mensagem
        .eq('id', id);

      if (error) {
        console.error('Erro ao salvar observação:', error);
        toast.error("Erro ao salvar observação");
        throw error;
      }
      
      console.log('Observação salva com sucesso');
      toast.success("Observação salva com sucesso");
    } catch (error) {
      console.error('Erro ao salvar observação:', error);
      toast.error("Erro ao salvar observação");
      throw error;
    }
  }
};
