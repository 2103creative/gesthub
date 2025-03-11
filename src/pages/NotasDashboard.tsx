
import React, { useEffect } from 'react';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { NotasTabs } from '../components/notas/NotasTabs';
import { NotasList } from '../components/notas/NotasList';
import { NotasService } from "../services/notasService";
import { useNotasFiscais } from '../hooks/useNotasFiscais';

const NotasDashboard = () => {
  // Buscar notas do Supabase
  const { data: notas = [], isLoading, error } = useQuery({
    queryKey: ['notas-fiscais-dashboard'],
    queryFn: NotasService.getAll,
  });

  const {
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    ordenacao,
    setOrdenacao,
    activeTab,
    setActiveTab,
    notasFiltradas
  } = useNotasFiscais(notas);

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar notas fiscais");
      console.error("Erro:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eink-white text-eink-black animate-fadeIn">
      <div className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-3 py-4 md:py-8">
          <div className="flex flex-col gap-4 mb-4">
            <h1 className="text-lg md:text-xl font-light uppercase">Controle de Notas Fiscais</h1>
            
            <div className="flex flex-col w-full gap-3">
              <NotasTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'pendentes' && (
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text"
                      placeholder="Buscar por razão social ou nota..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="w-full p-2 border border-eink-lightGray rounded text-sm focus:outline-none"
                    />
                  </div>
                  
                  <div className="w-full sm:w-1/3">
                    <select
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="w-full p-2 border border-eink-lightGray rounded text-sm focus:outline-none"
                    >
                      <option value="todos">Todos os status</option>
                      <option value="pendente">Pendente</option>
                      <option value="alerta-verde">Alerta Verde</option>
                      <option value="alerta-amarelo">Alerta Amarelo</option>
                      <option value="alerta-vermelho">Alerta Vermelho</option>
                      <option value="atrasado">Atrasado</option>
                    </select>
                  </div>
                  
                  <div className="w-full sm:w-1/3">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value as 'asc' | 'desc')}
                      className="w-full p-2 border border-eink-lightGray rounded text-sm focus:outline-none"
                    >
                      <option value="asc">Mais antigas primeiro</option>
                      <option value="desc">Mais recentes primeiro</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <span className="text-xs text-eink-gray">
                  {notasFiltradas.length} nota{notasFiltradas.length !== 1 ? 's' : ''} encontrada{notasFiltradas.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <NotasList 
            notas={notasFiltradas}
            activeTab={activeTab}
            isLoading={isLoading}
            onMarcarRetirado={undefined} // Remove ability to mark as retrieved
          />
        </div>
      </div>
      
      <footer className="w-full py-3 text-xs text-eink-gray text-center uppercase">
        © 2103 CREATIVE - 2025
      </footer>
    </div>
  );
};

export default NotasDashboard;
