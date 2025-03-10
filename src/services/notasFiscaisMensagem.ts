
import type { NotaFiscal } from "../types/NotaFiscal";
import { NotasFiscaisCommandService } from "./notasFiscaisCommand";
import { toast } from "sonner";

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
      
      // Keep the original primeira_mensagem if it exists
      if (nota.primeira_mensagem) {
        novaNota.primeira_mensagem = nota.primeira_mensagem;
      }

      // Create a new nota record
      await NotasFiscaisCommandService.create(novaNota);
      
      // Open WhatsApp with pre-filled message
      const mensagem = `Olá ${nota.contato}, passando para lembrar que a Nota Fiscal ${nota.numeroNota} da ${nota.razaoSocial} está disponível para retirada.`;
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
    const mensagem = `Olá ${nota.contato}, passando para lembrar que a Nota Fiscal ${nota.numeroNota} da ${nota.razaoSocial} está disponível para retirada.`;
    return `https://wa.me/${nota.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
  }
};
