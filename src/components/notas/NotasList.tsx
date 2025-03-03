
import React from 'react';
import { NotaFiscal } from "../../types/NotaFiscal";
import { NotaFiscalCard } from './NotaFiscalCard';
import { formatarData, getStatusMessage, getStatusStyle } from '../../utils/notasUtils';
import { CheckCircle } from 'lucide-react';

interface NotasListProps {
  notas: NotaFiscal[];
  activeTab: 'pendentes' | 'retirados';
  isLoading: boolean;
  onMarcarRetirado: (id: string) => void;
}

export const NotasList: React.FC<NotasListProps> = ({
  notas,
  activeTab,
  isLoading,
  onMarcarRetirado
}) => {
  const renderRetirarButton = (id: string) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onMarcarRetirado(id);
      }}
      className="px-2 py-1 text-xs bg-eink-black text-white rounded hover:bg-eink-gray transition-colors"
    >
      <div className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        <span>Retirado</span>
      </div>
    </button>
  );

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {notas.map((nota, index) => (
        <div key={nota.id || index} className="relative">
          <NotaFiscalCard
            nota={nota}
            formatarData={formatarData}
            getStatusMessage={getStatusMessage}
            getStatusStyle={getStatusStyle}
            onMarcarRetirado={activeTab === 'pendentes' ? onMarcarRetirado : undefined}
          />
          {activeTab === 'pendentes' && nota.id && !nota.retirado && (
            <div className="absolute top-3 right-3">
              {renderRetirarButton(nota.id)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
