// src/components/DropdownMenu.tsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";
import { ModalSendEmail } from "../ModalSendEmail";
import { useTranslation } from "react-i18next";
import profileImg from "@/assets/images/user-profile.png";

interface DropdownMenuProps {}

export const DropdownMenu: React.FC<DropdownMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut, user } = React.useContext(AuthContext);
  const { t } = useTranslation();

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

  const [modalInfo, setModalInfo] = useState(false);

  const handleModalInfo = () => {
    setModalInfo(true);
  };

  const handleLogout = () => {
    const confirmDelete = window.confirm(t("dropdownMenu.areYouSure"));
    if (!confirmDelete) return;
    signOut();
  };

  const profileImageUrl =
    user?.userDetails.profileImageUrl &&
    user.userDetails.profileImageUrl.trim() !== ""
      ? user.userDetails.profileImageUrl
      : profileImg;

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={profileImageUrl}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <div className="bg-gray-300 h-14 relative">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full overflow-hidden relative mt-3">
                <img
                  src={profileImageUrl}
                  alt="ProfileBig"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center ">
            <div className="text-sm">{user?.userDetails.name}</div>
            <div className="text-xs">{user?.email}</div>
          </div>
          <div className="mt-4">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleNavigate("/profile")}
            >
              <FaUser className="mr-2" />
              {t("dropdownMenu.profile")}
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={handleModalInfo}
            >
              <FaKey className="mr-2" />
              {t("dropdownMenu.changePassword")}
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              {t("dropdownMenu.logout")}
            </div>
          </div>
        </div>
      )}

      <ModalSendEmail modalInfo={modalInfo} setModalInfo={setModalInfo} />
    </div>
  );
};
