
import React from 'react';
import { NotaFiscal } from "../../types/NotaFiscal";
import { NotaFiscalCard } from './NotaFiscalCard';
import { formatarData, getStatusMessage, getStatusStyle } from '../../utils/notasUtils';

interface NotasListProps {
  notas: NotaFiscal[];
  activeTab: 'pendentes' | 'retirados';
  isLoading: boolean;
  onMarcarRetirado?: (id: string) => void;
  onReenviarMensagem?: (nota: NotaFiscal) => void;
}

export const NotasList: React.FC<NotasListProps> = ({
  notas,
  activeTab,
  isLoading,
  onMarcarRetirado,
  onReenviarMensagem
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-eink-gray uppercase">Carregando notas fiscais...</p>
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="text-center text-eink-gray uppercase mt-6 text-xs md:text-sm">
        {activeTab === 'pendentes' ? 'Nenhuma nota pendente encontrada' : 'Nenhuma nota retirada encontrada'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {notas.map((nota, index) => (
        <div key={nota.id || index} className="relative">
          <NotaFiscalCard
            nota={nota}
            formatarData={formatarData}
            getStatusMessage={getStatusMessage}
            getStatusStyle={getStatusStyle}
            onMarcarRetirado={onMarcarRetirado}
            onReenviarMensagem={onReenviarMensagem}
          />
        </div>
      ))}
    </div>
  );
}
