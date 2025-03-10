
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { NotaFiscal } from "@/types/NotaFiscal";

interface ConfirmSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota: NotaFiscal | null;
  onConfirm: (nota: NotaFiscal) => void;
}

export function ConfirmSendDialog({ open, onOpenChange, nota, onConfirm }: ConfirmSendDialogProps) {
  if (!nota) return null;

  const handleConfirm = () => {
    onConfirm(nota);
    onOpenChange(false);
  };

  const previewMessage = `Olá ${nota.contato}, passando para lembrar que a Nota Fiscal ${nota.numeroNota} da ${nota.razaoSocial} está disponível para retirada.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Confirmar envio
          </DialogTitle>
          <DialogDescription>
            Você está prestes a enviar uma nova mensagem de lembrete para {nota.contato}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="mb-2 text-sm font-medium">Prévia da mensagem:</h3>
          <div className="bg-muted p-3 rounded-md text-sm">
            {previewMessage}
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm"><strong>Telefone:</strong> {nota.telefone}</p>
            <p className="text-sm"><strong>Nota fiscal:</strong> {nota.numeroNota}</p>
            <p className="text-sm"><strong>Razão social:</strong> {nota.razaoSocial}</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Enviar mensagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
