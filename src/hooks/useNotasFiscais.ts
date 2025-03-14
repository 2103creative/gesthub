
import { useState, useMemo } from 'react';
import { NotaFiscal } from '../types/NotaFiscal';

export function useNotasFiscais(notas: NotaFiscal[] = []) {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'pendentes' | 'retirados'>('pendentes');

  const notasFiltradas = useMemo(() => {
    let notasFiltradas = [...notas];

    // Filtrar por retirado/pendente
    notasFiltradas = notasFiltradas.filter(nota => {
      if (activeTab === 'pendentes') {
        return !nota.retirado;
      } else {
        // Para aba "retirados", verificar se foi retirado e a data
        if (!nota.retirado) return false;
        
        // Se tem data_retirada, verificar se está dentro dos 7 dias
        if (nota.data_retirada) {
          const dataRetirada = new Date(nota.data_retirada);
          const hoje = new Date();
          const diffTime = Math.abs(hoje.getTime() - dataRetirada.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Filtrar apenas os que foram retirados há 7 dias ou menos
          return diffDays <= 7;
        }
        
        // Se não tem data_retirada, usa updated_at como alternativa
        if (nota.updated_at) {
          const dataRetirada = new Date(nota.updated_at);
          const hoje = new Date();
          const diffTime = Math.abs(hoje.getTime() - dataRetirada.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Filtrar apenas os que foram retirados há 7 dias ou menos
          return diffDays <= 7;
        }
        
        // Se não tem nenhuma data disponível, mostra por padrão
        return true;
      }
    });

    if (filtroStatus !== 'todos' && activeTab === 'pendentes') {
      notasFiltradas = notasFiltradas.filter(nota => nota.status === filtroStatus);
    }

    if (busca) {
      const termoBusca = busca.toLowerCase();
      notasFiltradas = notasFiltradas.filter(nota => 
        nota.razaoSocial.toLowerCase().includes(termoBusca) ||
        nota.numeroNota.toLowerCase().includes(termoBusca)
      );
    }

    // Para as notas pendentes, agrupamos por razão social e número da nota
    // e mantemos apenas o registro mais recente
    if (activeTab === 'pendentes') {
      const notasUnicas = new Map();
      
      notasFiltradas.forEach(nota => {
        const chave = `${nota.razaoSocial}-${nota.numeroNota}`;
        if (!notasUnicas.has(chave) || new Date(nota.dataEnvioMensagem) > new Date(notasUnicas.get(chave).dataEnvioMensagem)) {
          notasUnicas.set(chave, nota);
        }
      });
      
      notasFiltradas = Array.from(notasUnicas.values());
    }

    // Ordenação
    notasFiltradas.sort((a, b) => {
      const dataA = new Date(a.dataEnvioMensagem).getTime();
      const dataB = new Date(b.dataEnvioMensagem).getTime();
      return ordenacao === 'asc' ? dataA - dataB : dataB - dataA;
    });

    return notasFiltradas;
  }, [notas, activeTab, filtroStatus, busca, ordenacao]);

  return {
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    ordenacao,
    setOrdenacao,
    activeTab,
    setActiveTab,
    notasFiltradas
  };
}
