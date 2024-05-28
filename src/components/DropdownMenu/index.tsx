// src/components/DropdownMenu.tsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";

interface DropdownMenuProps {}

export const DropdownMenu: React.FC<DropdownMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src="public/images/me.jpg"
        alt="Profile"
        className="w-8 h-8 rounded-full bg-contain cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <div className="bg-gray-300 h-14 relative">
            <div className="flex items-center justify-center">
              <img
                src="public/images/me.jpg"
                alt="ProfileBig"
                className="w-14 h-14 rounded-full bg-contain cursor-pointer relative mt-3"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center ">
            <div className="text-sm">Cristiano</div>
            <div className="text-xs">cristiano@email.com</div>
          </div>
          <div className="mt-4">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleNavigate("/profile")}
            >
              <FaUser className="mr-2" />
              Perfil
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleNavigate("/settings")}
            >
              <FaKey className="mr-2" />
              Alterar Senha
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => signOut()}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
