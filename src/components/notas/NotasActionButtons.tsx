
import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

interface NotasActionButtonsProps {
  onRefresh: () => void;
  onUpdateStatus?: () => void;
  atualizandoStatus?: boolean;
  activeTab: 'pendentes' | 'retirados';
}

export const NotasActionButtons: React.FC<NotasActionButtonsProps> = ({
  onRefresh,
  onUpdateStatus,
  atualizandoStatus = false,
  activeTab
}) => {
  return (
    <div className="flex gap-2 self-end">
      <button
        onClick={onRefresh}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 text-xs md:text-sm"
      >
        Atualizar
      </button>
      
      {activeTab === 'pendentes' && onUpdateStatus && (
        <button
          onClick={onUpdateStatus}
          disabled={atualizandoStatus}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 text-xs md:text-sm"
        >
          <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${atualizandoStatus ? 'animate-spin' : ''}`} />
          Atualizar Status
        </button>
      )}
      
      <button
        onClick={() => window.print()}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 text-xs md:text-sm"
      >
        <Download className="w-3 h-3 md:w-4 md:h-4" />
        Exportar
      </button>
    </div>
  );
};
