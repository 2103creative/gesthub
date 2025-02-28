
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import type { NotaFiscal } from "../types/NotaFiscal";
import { Download, RefreshCw } from 'lucide-react';
import { NotasFilters } from '../components/notas/NotasFilters';
import { NotaFiscalCard } from '../components/notas/NotaFiscalCard';
import { formatarData, getStatusMessage, getStatusStyle } from '../utils/notasUtils';
import { NotasService } from "../services/notasService";
import { useQuery } from '@tanstack/react-query';

const NotasControl = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'asc' | 'desc'>('asc');
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);

  // Buscar notas do Supabase
  const { data: notas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['notas-fiscais'],
    queryFn: NotasService.getAll,
  });

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

  const filtrarNotas = () => {
    let notasFiltradas = [...notas];

    if (filtroStatus !== 'todos') {
      notasFiltradas = notasFiltradas.filter(nota => nota.status === filtroStatus);
    }

    if (busca) {
      const termoBusca = busca.toLowerCase();
      notasFiltradas = notasFiltradas.filter(nota => 
        nota.razaoSocial.toLowerCase().includes(termoBusca) ||
        nota.numeroNota.toLowerCase().includes(termoBusca)
      );
    }

    notasFiltradas.sort((a, b) => {
      const dataA = new Date(a.dataEnvioMensagem).getTime();
      const dataB = new Date(b.dataEnvioMensagem).getTime();
      return ordenacao === 'asc' ? dataA - dataB : dataB - dataA;
    });

    return notasFiltradas;
  };

  const notasFiltradas = filtrarNotas();

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
              <NotasFilters
                busca={busca}
                setBusca={setBusca}
                filtroStatus={filtroStatus}
                setFiltroStatus={setFiltroStatus}
                ordenacao={ordenacao}
                setOrdenacao={setOrdenacao}
              />

              <div className="flex gap-2 self-end">
                <button
                  onClick={() => refetch()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 text-xs md:text-sm"
                >
                  Atualizar
                </button>
                
                <button
                  onClick={handleAtualizarStatus}
                  disabled={atualizandoStatus}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 text-xs md:text-sm"
                >
                  <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${atualizandoStatus ? 'animate-spin' : ''}`} />
                  Atualizar Status
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-eink-lightGray rounded-lg hover:bg-eink-lightGray/10 text-xs md:text-sm"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-eink-gray uppercase">Carregando notas fiscais...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {notasFiltradas.map((nota, index) => (
                <NotaFiscalCard
                  key={nota.id || index}
                  nota={nota}
                  formatarData={formatarData}
                  getStatusMessage={getStatusMessage}
                  getStatusStyle={getStatusStyle}
                />
              ))}
            </div>
          )}

          {!isLoading && notasFiltradas.length === 0 && (
            <div className="text-center text-eink-gray uppercase mt-6 text-xs md:text-sm">
              Nenhuma nota encontrada
            </div>
          )}
        </div>
      </div>
      
      <footer className="w-full py-3 text-xs text-eink-gray text-center uppercase">
        © 2025 - DESENVOLVIDO POR 2103 CREATIVE - DESDE 2024
      </footer>
    </div>
  );
};

export default NotasControl;
