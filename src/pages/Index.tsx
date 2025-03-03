
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
      className="block w-[200px] h-[40px] leading-[40px] mx-auto bg-eink-black hover:bg-eink-gray transition-colors duration-200 rounded-lg shadow-sm relative"
    >
      <span className="text-[14px] font-medium text-white uppercase font-quicksand absolute left-1/2 -translate-x-1/3">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eink-white text-eink-black animate-fadeIn">
      <div className="flex-grow flex flex-col justify-center">
        <div className="max-w-[80%] w-full mx-auto px-3 py-6">
          <h1 className="text-[18px] font-quicksand font-light text-center mb-10 uppercase">
            GestHub
          </h1>
          
          <nav className="space-y-4">
            {menuLinks.map(renderMenuLink)}
          </nav>
        </div>
      </div>
      
      <footer className="w-full py-10 text-xs text-eink-gray text-center uppercase">
        © 2103 CREATIVE - 2025
      </footer>
    </div>
  );
};

export default MainMenu;
