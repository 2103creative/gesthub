
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
import { NotaFiscal } from '../types/NotaFiscal';
import { ConfirmSendDialog } from '../components/notas/ConfirmSendDialog';

const NotasControl = () => {
  const navigate = useNavigate();
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null);
  
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

  const handleReenviarMensagem = async (nota: NotaFiscal) => {
    setSelectedNota(nota);
    setDialogOpen(true);
  };

  const handleConfirmSend = async (nota: NotaFiscal) => {
    try {
      await NotasService.reenviarMensagem(nota);
      refetch();
    } catch (error) {
      console.error("Erro ao reenviar mensagem:", error);
    }
  };

  const handleSaveMensagem = async (nota: NotaFiscal, mensagem: string) => {
    try {
      if (nota.id) {
        console.log('NotasControl - Saving message:', mensagem, 'for nota:', nota.id);
        await NotasService.updateMensagem(nota.id, mensagem);
        await refetch();
      }
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eink-white text-eink-black animate-fadeIn">
      <div className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-3 py-4 md:py-8">
          <button 
            onClick={() => navigate('/')}
            className="mb-4 md:mb-6 text-eink-gray hover:text-eink-black uppercase text-xs"
          >
            ← VOLTAR
          </button>

          <div className="flex flex-col gap-4 mb-4">
            <h1 className="text-lg md:text-xl font-light uppercase">Controle de Notas Fiscais</h1>
            
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
            onReenviarMensagem={activeTab === 'pendentes' ? handleReenviarMensagem : undefined}
            onSaveMensagem={handleSaveMensagem}
          />
        </div>
      </div>
      
      <footer className="w-full py-3 text-xs text-eink-gray text-center uppercase">
        © 2103 CREATIVE - 2025
      </footer>

      <ConfirmSendDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nota={selectedNota}
        onConfirm={handleConfirmSend}
      />
    </div>
  );
};

export default NotasControl;
