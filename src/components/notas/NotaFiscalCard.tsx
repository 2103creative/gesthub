
import React from 'react';
import type { NotaFiscal } from '../../types/NotaFiscal';

interface NotaFiscalCardProps {
  nota: NotaFiscal;
  formatarData: (data: Date) => string;
  getStatusMessage: (status: string, dataPrimeiraMensagem?: Date | string) => string;
  getStatusStyle: (status: string, dataPrimeiraMensagem?: Date | string) => string;
  onMarcarRetirado?: (id: string) => void;
}

export const NotaFiscalCard: React.FC<NotaFiscalCardProps> = ({
  nota,
  formatarData,
  getStatusMessage,
  getStatusStyle,
  onMarcarRetirado,
}) => {
  return (
    <div className="relative w-full bg-eink-white rounded-lg border border-eink-lightGray shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="p-2.5 md:p-3">
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Razão Social</p>
              <p className="font-medium text-sm uppercase truncate font-quicksand">{nota.razaoSocial}</p>
            </div>
            {onMarcarRetirado && nota.id && (
              <button
                onClick={() => onMarcarRetirado(nota.id!)}
                className="h-7 px-2 text-xs font-medium uppercase bg-eink-black text-white rounded hover:bg-eink-gray transition-colors"
              >
                Retirado
              </button>
            )}
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
            <p className="font-medium text-xs font-quicksand">{formatarData(nota.dataEnvioMensagem)}</p>
          </div>

          {nota.primeira_mensagem && nota.dataEnvioMensagem !== nota.primeira_mensagem && (
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Primeira Mensagem</p>
              <p className="font-medium text-xs font-quicksand">{formatarData(new Date(nota.primeira_mensagem))}</p>
            </div>
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
    </div>
  );
};
