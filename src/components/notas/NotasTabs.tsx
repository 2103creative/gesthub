
import React from 'react';

interface NotasTabsProps {
  activeTab: 'pendentes' | 'retirados';
  setActiveTab: (tab: 'pendentes' | 'retirados') => void;
}

export const NotasTabs: React.FC<NotasTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-eink-lightGray mb-2">
      <button
        onClick={() => setActiveTab('pendentes')}
        className={`px-4 py-2 text-sm font-medium uppercase ${
          activeTab === 'pendentes' 
            ? 'border-b-2 border-eink-black' 
            : 'text-eink-gray'
        }`}
      >
        Retirar
      </button>
      <button
        onClick={() => setActiveTab('retirados')}
        className={`px-4 py-2 text-sm font-medium uppercase ${
          activeTab === 'retirados' 
            ? 'border-b-2 border-eink-black' 
            : 'text-eink-gray'
        }`}
      >
        Retirado
      </button>
    </div>
  );
};
