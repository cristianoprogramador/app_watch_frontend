import React, { ReactNode } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (pathname: string) => location.pathname === pathname;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-36 bg-blue-800 text-white">
        <div className="p-5 text-xl font-semibold select-none">App-Watch</div>
        <ul className="mt-12">
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/home") && "bg-blue-900"
            }`}
          >
            Inicio
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/add") && "bg-blue-900"
            }`}
          >
            Adicionar
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/settings") && "bg-blue-900"
            }`}
          >
            Configurações
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/profile") && "bg-blue-900"
            }`}
          >
            Perfil
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/logout") && "bg-blue-900"
            }`}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-blue-800 text-white flex flex-row justify-between">
          <div className="text-xl font-semibold">Bem Vindo ao Dashboard</div>
          <div className="flex flex-row gap-2">
            <img
              src="public/images/me.jpg"
              alt=""
              className="w-10 h-10 rounded-full bg-contain"
            />
            <div className="flex flex-col">
              <div>Cristiano Silva</div>
              <div className="text-xs md:text-sm">
                cristiano.silva@gmail.com
              </div>
            </div>
            <div className="h-full flex items-center cursor-pointer">
              <MdOutlineKeyboardArrowDown size={20} />
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
