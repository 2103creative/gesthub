
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { NotasFilters } from '../components/notas/NotasFilters';
import { NotasTabs } from '../components/notas/NotasTabs';
import { NotasActionButtons } from '../components/notas/NotasActionButtons';
import { NotasList } from '../components/notas/NotasList';
import { NotasService } from "../services/notasService";
import { useNotasFiscais } from '../hooks/useNotasFiscais';

const NotasControl = () => {
  const navigate = useNavigate();
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  
  // Buscar notas do Supabase
  const { data: notas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['notas-fiscais'],
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

  const handleAtualizarStatus = async () => {
    try {
      setAtualizandoStatus(true);
      await NotasService.atualizarStatus();
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setAtualizandoStatus(false);
    }
  };

  const handleMarcarRetirado = async (id: string) => {
    try {
      await NotasService.marcarRetirado(id);
      refetch();
    } catch (error) {
      console.error("Erro ao marcar nota como retirada:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eink-white text-eink-black animate-fadeIn">
      <div className="flex-grow">
        <div className="w-full max-w-6xl mx-auto px-3 py-6 md:py-12">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 md:mb-8 text-eink-gray hover:text-eink-black uppercase text-xs md:text-sm"
          >
            ← VOLTAR
          </button>

          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-lg md:text-2xl font-light uppercase">Controle de Notas</h1>
            
            <div className="flex flex-col w-full gap-3">
              <NotasTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'pendentes' && (
                <NotasFilters
                  busca={busca}
                  setBusca={setBusca}
                  filtroStatus={filtroStatus}
                  setFiltroStatus={setFiltroStatus}
                  ordenacao={ordenacao}
                  setOrdenacao={setOrdenacao}
                />
              )}

              <NotasActionButtons 
                onRefresh={refetch}
                onUpdateStatus={handleAtualizarStatus}
                atualizandoStatus={atualizandoStatus}
                activeTab={activeTab}
              />
            </div>
          </div>

          <NotasList 
            notas={notasFiltradas}
            activeTab={activeTab}
            isLoading={isLoading}
            onMarcarRetirado={handleMarcarRetirado}
          />
        </div>
      </div>
      
      <footer className="w-full py-3 text-xs text-eink-gray text-center uppercase">
        © 2025 - DESENVOLVIDO POR 2103 CREATIVE - DESDE 2024
      </footer>
    </div>
  );
};

export default NotasControl;
