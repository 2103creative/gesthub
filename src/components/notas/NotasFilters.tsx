
import React from 'react';
import { Search, Calendar } from 'lucide-react';

interface NotasFiltersProps {
  busca: string;
  setBusca: (value: string) => void;
  filtroStatus: string;
  setFiltroStatus: (value: string) => void;
  ordenacao: 'asc' | 'desc';
  setOrdenacao: (value: 'asc' | 'desc') => void;
}

export const NotasFilters: React.FC<NotasFiltersProps> = ({
  busca,
  setBusca,
  filtroStatus,
  setFiltroStatus,
  ordenacao,
  setOrdenacao
}) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full items-start sm:items-center">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-eink-gray w-3 h-3 md:w-4 md:h-4" />
        <input
          type="text"
          placeholder="Buscar nota fiscal..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full sm:w-[200px] h-[40px] pl-8 pr-3 text-xs md:text-sm border border-eink-lightGray rounded-lg focus:outline-none focus:border-eink-gray font-quicksand"
        />
      </div>

      <select
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
        className="w-full sm:w-[200px] h-[40px] px-3 text-xs md:text-sm border border-eink-lightGray rounded-lg focus:outline-none focus:border-eink-gray font-quicksand"
      >
        <option value="todos">Todos os status</option>
        <option value="atrasado">Atrasados</option>
        <option value="alerta-vermelho">Próximo ao vencimento</option>
        <option value="alerta-amarelo">Em andamento</option>
        <option value="alerta-verde">Prazo confortável</option>
      </select>

      <button
        onClick={() => setOrdenacao(ordenacao === 'asc' ? 'desc' : 'asc')}
        className="w-full sm:w-auto h-[40px] flex items-center justify-center gap-2 px-3 text-xs md:text-sm border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 font-quicksand"
      >
        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
        {ordenacao === 'asc' ? 'Mais antigos' : 'Mais recentes'}
      </button>
    </div>
  );
};
