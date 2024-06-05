import React, { ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu } from "../DropdownMenu";
import { AuthContext } from "../../contexts/AuthContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

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
      <div className="w-48 bg-theme-sidebar-bg text-white">
        <div className="p-5 text-xl font-semibold select-none">App-Watch</div>
        <ul className="mt-12">
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/home") && "bg-blue-900"
            }`}
            onClick={() => navigate("/home")}
          >
            {t("mainLayout.overview")}
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/settings") && "bg-blue-900"
            }`}
            onClick={() => navigate("/settings")}
          >
            {t("mainLayout.settings")}
          </li>
          <li
            className={`p-4 hover:bg-blue-700 cursor-pointer ${
              isActive("/profile") && "bg-blue-900"
            }`}
            onClick={() => navigate("/profile")}
          >
            {t("mainLayout.profile")}
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 flex flex-row justify-between">
          <div className="text-xl font-semibold text-theme-text-color">
            {t("mainLayout.welcome", { name: user?.userDetails.name })}
          </div>
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
                src={"public/images/flagbrazil.svg"}
                alt="PT"
                className={`w-[30px] h-[20px] cursor-pointer ${
                  language === "pt" ? "border rounded border-blue-500" : ""
                }`}
                onClick={() => changeLanguage("pt")}
              />
              <img
                src={"public/images/flagEUA.svg"}
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
