import React, { ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu } from "../DropdownMenu";
import { AuthContext } from "../../contexts/AuthContext";
import {
  MdErrorOutline,
  MdOutlineDashboardCustomize,
  MdOutlineWbSunny,
} from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile, CgWebsite } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import flagBrazil from "@/assets/images/flagbrazil.svg";
import flagEUA from "@/assets/images/flagEUA.svg";
import { TbRoute } from "react-icons/tb";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const isActive = (pathname: string) => location.pathname === pathname;

  return (
    <div className="flex h-screen bg-theme-bg">
      <div className="w-48 bg-theme-sidebar-bg text-white md:flex flex-col hidden">
        <div className="p-5 text-xl font-semibold select-none">App-Watch</div>
        <ul className="mt-12">
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
              isActive("/home") && "bg-blue-900"
            }`}
            onClick={() => navigate("/home")}
          >
            <MdOutlineDashboardCustomize size={20} />
            {t("mainLayout.overview")}
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
              isActive("/settings") && "bg-blue-900"
            }`}
            onClick={() => navigate("/settings")}
          >
            <IoSettingsOutline size={20} />

            {t("mainLayout.settings")}
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
              isActive("/profile") && "bg-blue-900"
            }`}
            onClick={() => navigate("/profile")}
          >
            <CgProfile size={20} />
            {t("mainLayout.profile")}
          </li>
          {user?.type === "admin" && (
            <>
              <li
                className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
                  isActive("/errorLogs") && "bg-blue-900"
                }`}
                onClick={() => navigate("/errorLogs")}
              >
                <MdErrorOutline size={20} />
                {t("mainLayout.errorLogs")}
              </li>
              <li
                className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
                  isActive("/users") && "bg-blue-900"
                }`}
                onClick={() => navigate("/users")}
              >
                <FaUsers size={20} />
                {t("mainLayout.users")}
              </li>
              <li
                className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
                  isActive("/websites") && "bg-blue-900"
                }`}
                onClick={() => navigate("/websites")}
              >
                <CgWebsite size={20} />
                {t("mainLayout.websites")}
              </li>
              <li
                className={`p-4 hover:bg-blue-700 cursor-pointer flex flex-row items-center gap-3 ${
                  isActive("/routes") && "bg-blue-900"
                }`}
                onClick={() => navigate("/routes")}
              >
                <TbRoute size={20} />
                {t("mainLayout.routes")}
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 flex flex-row justify-between">
          <div className="text-xl font-semibold text-theme-text-color md:flex flex-col hidden">
            {t("mainLayout.welcome", { name: user?.userDetails.name })}
          </div>
          <ul className="md:hidden flex flex-row text-white gap-2">
            <li
              className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                isActive("/home") && "bg-blue-900"
              }`}
              onClick={() => navigate("/home")}
            >
              <MdOutlineDashboardCustomize size={20} />
            </li>
            <li
              className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                isActive("/settings") && "bg-blue-900"
              }`}
              onClick={() => navigate("/settings")}
            >
              <IoSettingsOutline size={20} />
            </li>
            <li
              className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                isActive("/profile") && "bg-blue-900"
              }`}
              onClick={() => navigate("/profile")}
            >
              <CgProfile size={20} />
            </li>
            {user?.type === "admin" && (
              <>
                <li
                  className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                    isActive("/errorLogs") && "bg-blue-900"
                  }`}
                  onClick={() => navigate("/errorLogs")}
                >
                  <MdErrorOutline size={20} />
                </li>
                <li
                  className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                    isActive("/users") && "bg-blue-900"
                  }`}
                  onClick={() => navigate("/users")}
                >
                  <FaUsers size={20} />
                </li>
                <li
                  className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                    isActive("/websites") && "bg-blue-900"
                  }`}
                  onClick={() => navigate("/websites")}
                >
                  <CgWebsite size={20} />
                </li>
                <li
                  className={`p-2 hover:bg-blue-700 bg-blue-500 rounded-lg cursor-pointer flex flex-row items-center gap-3 ${
                    isActive("/routes") && "bg-blue-900"
                  }`}
                  onClick={() => navigate("/routes")}
                >
                  <TbRoute size={20} />
                </li>
              </>
            )}
          </ul>
          <div className="flex flex-row gap-4 items-center">
            {theme === "light" ? (
              <GoMoon
                size={20}
                onClick={toggleTheme}
                className="cursor-pointer"
                color="black"
              />
            ) : (
              <MdOutlineWbSunny
                size={20}
                onClick={toggleTheme}
                className="cursor-pointer"
                color="white"
              />
            )}
            <div className="flex flex-row">
              <img
                src={flagBrazil}
                alt="PT"
                className={`w-[30px] h-[20px] cursor-pointer ${
                  language === "pt" ? "border rounded border-blue-500" : ""
                }`}
                onClick={() => changeLanguage("pt")}
              />
              <img
                src={flagEUA}
                alt="EN"
                className={`w-[30px] h-[20px] cursor-pointer ${
                  language === "en" ? "border rounded border-blue-500" : ""
                }`}
                onClick={() => changeLanguage("en")}
              />
            </div>
            <DropdownMenu />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
