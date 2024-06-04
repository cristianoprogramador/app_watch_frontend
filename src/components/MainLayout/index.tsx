import React, { ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu } from "../DropdownMenu";
import { AuthContext } from "../../contexts/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isActive = (pathname: string) => location.pathname === pathname;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-48 bg-blue-800 text-white">
        <div className="p-5 text-xl font-semibold select-none">App-Watch</div>
        <ul className="mt-12">
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/home") && "bg-blue-900"
            }`}
            onClick={() => navigate("/home")}
          >
            Visão Geral
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/settings") && "bg-blue-900"
            }`}
            onClick={() => navigate("/settings")}
          >
            Configurações
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/profile") && "bg-blue-900"
            }`}
            onClick={() => navigate("/profile")}
          >
            Perfil
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 flex flex-row justify-between">
          <div className="text-xl font-semibold">Bem Vindo ao Dashboard, {user?.userDetails.name}</div>
          <div className="flex flex-row gap-2">
            <DropdownMenu />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
