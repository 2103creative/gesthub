
import React from 'react';
import { Link } from 'react-router-dom';

interface MenuLink {
  to: string;
  label: string;
}

const menuLinks: MenuLink[] = [
  { to: "/client-pickup", label: "Cliente Retira" },
  { to: "/schedule-collection", label: "Agendar Coleta" },
  { to: "/request-quote", label: "Cotação" },
  { to: "/notas-control", label: "Controle Notas" }
];

const MainMenu = () => {
  const renderMenuLink = ({ to, label }: MenuLink) => (
    <Link 
      key={to}
      to={to}
      className="block w-[200px] h-[40px] leading-[40px] mx-auto bg-[#ea384c] hover:bg-red-600 transition-colors duration-200 rounded-lg shadow-sm"
    >
      <span className="text-[14px] font-bold text-white uppercase font-quicksand">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eink-white text-eink-black animate-fadeIn">
      <div className="flex-grow flex flex-col justify-center">
        <div className="max-w-[80%] w-full mx-auto px-3 py-6">
          <h1 className="text-[18px] font-quicksand font-light text-center mb-6 uppercase">
            GestHub
          </h1>
          
          <nav className="space-y-4">
            {menuLinks.map(renderMenuLink)}
          </nav>
        </div>
      </div>
      
      <footer className="w-full py-3 text-xs text-eink-gray text-center uppercase">
        © 2025 - DESENVOLVIDO POR 2103 CREATIVE - DESDE 2024
      </footer>
    </div>
  );
};

export default MainMenu;
