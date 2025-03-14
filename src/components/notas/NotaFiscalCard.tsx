
import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import type { NotaFiscal } from '../../types/NotaFiscal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotaFiscalCardProps {
  nota: NotaFiscal;
  formatarData: (data: Date) => string;
  getStatusMessage: (status: string, dataPrimeiraMensagem?: Date | string) => string;
  getStatusStyle: (status: string, dataPrimeiraMensagem?: Date | string) => string;
  onMarcarRetirado?: (id: string) => void;
  onReenviarMensagem?: (nota: NotaFiscal) => void;
  onSaveMensagem?: (nota: NotaFiscal, mensagem: string) => void;
}

export const NotaFiscalCard: React.FC<NotaFiscalCardProps> = ({
  nota,
  formatarData,
  getStatusMessage,
  getStatusStyle,
  onMarcarRetirado,
  onReenviarMensagem,
  onSaveMensagem,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [mensagem, setMensagem] = useState(nota.mensagem || '');

  const calculaMensagens = () => {
    if (!nota.dataEnvioMensagem) return "0x";
    if (!nota.primeira_mensagem) return "1x";
    
    const dataEnvio = new Date(nota.dataEnvioMensagem);
    const dataPrimeira = new Date(nota.primeira_mensagem);
    
    if (dataEnvio.toDateString() === dataPrimeira.toDateString() && !nota.mensagem_count) return "1x";
    
    if (nota.mensagem_count && nota.mensagem_count > 0) {
      return `${nota.mensagem_count}x`;
    }
    
    const diffTime = Math.abs(dataEnvio.getTime() - dataPrimeira.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const messageCount = Math.ceil(diffDays / 2) + 1;
    
    return `${messageCount}x`;
  };

  const handleSaveMensagem = () => {
    if (onSaveMensagem && nota.id) {
      console.log('Saving message:', mensagem, 'for nota:', nota.id);
      onSaveMensagem(nota, mensagem);
    }
    setEditDialogOpen(false);
  };

  return (
    <div className="relative w-full bg-eink-white rounded-lg border border-eink-lightGray shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="p-2.5 md:p-3">
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-eink-gray text-xs uppercase font-quicksand">Razão Social</p>
              <p className="font-medium text-sm uppercase truncate font-quicksand">{nota.razaoSocial}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {onReenviarMensagem && (
                <button
                  onClick={() => onReenviarMensagem(nota)}
                  className="h-6 px-1.5 text-xs font-medium uppercase bg-eink-black text-white rounded hover:bg-eink-gray transition-colors whitespace-nowrap"
                >
                  Reenviar
                </button>
              )}
              {onMarcarRetirado && nota.id && (
                <button
                  onClick={() => onMarcarRetirado(nota.id!)}
                  className="h-6 px-1.5 text-xs font-medium uppercase bg-eink-black text-white rounded hover:bg-eink-gray transition-colors whitespace-nowrap"
                >
                  Retirado
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Nota Fiscal</p>
              <p className="font-medium text-xs uppercase font-quicksand">{nota.numeroNota}</p>
            </div>
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Emissão</p>
              <p className="font-medium text-xs font-quicksand">{formatarData(nota.dataEmissao)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Contato</p>
              <p className="font-medium text-xs uppercase truncate font-quicksand">{nota.contato}</p>
            </div>
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Telefone</p>
              <p className="font-medium text-xs font-quicksand">{nota.telefone}</p>
            </div>
          </div>

          <div>
            <p className="text-eink-gray text-xs uppercase font-quicksand">Mensagem Enviada</p>
            <p className="font-medium text-xs font-quicksand">
              {formatarData(nota.dataEnvioMensagem)} - {calculaMensagens()}
            </p>
          </div>

          {nota.primeira_mensagem && nota.dataEnvioMensagem !== nota.primeira_mensagem && (
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Primeira Mensagem</p>
              <p className="font-medium text-xs font-quicksand">{formatarData(new Date(nota.primeira_mensagem))}</p>
            </div>
          )}
        </div>

        <div className="mt-2 border border-eink-lightGray rounded-md relative">
          <div className="p-2 h-24 overflow-y-auto text-xs font-quicksand break-words">
            {nota.mensagem ? nota.mensagem : 'Sem observações'}
          </div>
          {onSaveMensagem && (
            <button 
              onClick={() => setEditDialogOpen(true)}
              className="absolute top-1 right-1 p-1 text-eink-gray hover:text-eink-black"
            >
              <Pen size={16} />
            </button>
          )}
        </div>

        {!nota.retirado && nota.status !== 'pendente' && (
          <div className={`mt-2 p-2 rounded-md uppercase text-xs font-medium font-quicksand ${getStatusStyle(nota.status)}`}>
            {getStatusMessage(nota.status)}
          </div>
        )}

        {!nota.retirado && nota.status === 'pendente' && nota.primeira_mensagem && (
          <div className={`mt-2 p-2 rounded-md uppercase text-xs font-medium font-quicksand ${getStatusStyle(nota.status, nota.primeira_mensagem)}`}>
            {getStatusMessage(nota.status, nota.primeira_mensagem)}
          </div>
        )}

        {nota.retirado && (
          <div className="mt-2 p-2 rounded-md uppercase text-xs font-medium font-quicksand bg-eink-lightGray text-eink-gray">
            Retirado em {formatarData(new Date(nota.data_retirada || nota.updated_at || new Date()))}
          </div>
        )}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Observação</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full h-32 p-2 border border-eink-lightGray rounded-md text-sm focus:outline-none"
              placeholder="Digite uma observação para esta nota fiscal..."
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMensagem}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
