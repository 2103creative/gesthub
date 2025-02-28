
import React from 'react';
import type { NotaFiscal } from '../../types/NotaFiscal';

interface NotaFiscalCardProps {
  nota: NotaFiscal;
  formatarData: (data: Date) => string;
  getStatusMessage: (status: string) => string;
  getStatusStyle: (status: string) => string;
}

export const NotaFiscalCard: React.FC<NotaFiscalCardProps> = ({
  nota,
  formatarData,
  getStatusMessage,
  getStatusStyle,
}) => {
  return (
    <div className="relative w-full bg-eink-white rounded-lg border border-eink-lightGray shadow-sm md:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.3)]">
      <div className="p-3 md:p-5">
        <div className="space-y-2.5 md:space-y-4">
          <div>
            <p className="text-eink-gray text-xs uppercase font-quicksand">Razão Social</p>
            <p className="font-medium text-sm md:text-base uppercase truncate font-quicksand">{nota.razaoSocial}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Nota Fiscal</p>
              <p className="font-medium text-xs md:text-sm uppercase font-quicksand">{nota.numeroNota}</p>
            </div>
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Emissão</p>
              <p className="font-medium text-xs md:text-sm font-quicksand">{formatarData(nota.dataEmissao)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Contato</p>
              <p className="font-medium text-xs md:text-sm uppercase truncate font-quicksand">{nota.contato}</p>
            </div>
            <div>
              <p className="text-eink-gray text-xs uppercase font-quicksand">Telefone</p>
              <p className="font-medium text-xs md:text-sm font-quicksand">{nota.telefone}</p>
            </div>
          </div>

          <div>
            <p className="text-eink-gray text-xs uppercase font-quicksand">Mensagem Enviada</p>
            <p className="font-medium text-xs md:text-sm font-quicksand">{formatarData(nota.dataEnvioMensagem)}</p>
          </div>
        </div>

        {nota.status !== 'pendente' && (
          <div className={`mt-2.5 md:mt-4 p-2 md:p-3 rounded-md uppercase text-xs font-medium font-quicksand ${getStatusStyle(nota.status)}`}>
            {getStatusMessage(nota.status)}
          </div>
        )}
      </div>
    </div>
  );
};
