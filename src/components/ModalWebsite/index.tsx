// src\components\ModalWebsite\index.tsx

import { SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { FaRegTrashAlt } from "react-icons/fa";
import { api } from "../../utils/api";
import { Button } from "../Button";
import { UserDataDto } from "../../contexts/AuthContext";
import { Website } from "../../types/website-routes";
import { useTranslation } from "react-i18next";

interface Route {
  method: string;
  route: string;
  body: string;
  uuid: string;
}

interface ModalWebsiteProps {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
  user: UserDataDto | null;
  fetchProjects: () => Promise<void>;
  websiteData?: Website | null;
}

export const ModalWebsite = ({
  modalInfo,
  setModalInfo,
  user,
  fetchProjects,
  websiteData = null,
}: ModalWebsiteProps) => {
  const isEditing = websiteData !== null;
  const [siteName, setSiteName] = useState(isEditing ? websiteData.name : "");
  const [siteUrl, setSiteUrl] = useState(isEditing ? websiteData.url : "");
  const [token, setToken] = useState(isEditing ? websiteData.token : "");
  const [routes, setRoutes] = useState<Route[]>(
    isEditing ? websiteData.routes : []
  );
  const { t } = useTranslation();

  const handleAddRoute = () => {
    setRoutes([...routes, { method: "GET", route: "", body: "", uuid: "" }]);
  };

  const handleDeleteWebsites = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const confirmDelete = window.confirm(t("modalWebsites.areYouSureSite"));
    if (!confirmDelete) return;
    try {
      await api.delete(`/website-monitoring/${websiteData?.uuid}`);
      // console.log("Route deleted successfully", response);
      fetchProjects();
      setModalInfo(false);
    } catch (error) {
      console.error("Failed to delete the website", error);
    }
  };

  const handleRemoveRoute = (index: number) => {
    const newRoutes = routes.filter((_, i) => i !== index);
    setRoutes(newRoutes);
  };

  const handleRouteChange = (
    index: number,
    key: keyof Route,
    value: string | boolean
  ) => {
    const newRoutes = routes.map((route, i) =>
      i === index ? { ...route, [key]: value } : route
    );
    setRoutes(newRoutes);
  };

  const handleAddOrEditWebsite = async () => {
    const url = isEditing
      ? `/website-monitoring/${websiteData?.uuid}`
      : "/website-monitoring";
    const method = isEditing ? "patch" : "post";

    try {
      await api[method](url, {
        name: siteName,
        url: siteUrl,
        token,
        routes,
        userId: user?.uuid,
      });
      fetchProjects();
      setModalInfo(false);
    } catch (error) {
      console.error("Error saving the website:", error);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    const confirmDelete = window.confirm(t("modalWebsites.areYouSureRoute"));
    if (!confirmDelete) return;
    try {
      const response = await api.delete(
        `/website-monitoring/routes/${routeId}`
      );
      // console.log("Route deleted successfully", response);
      fetchProjects();
      setModalInfo(false);
    } catch (error) {
      console.error("Failed to delete the route", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddOrEditWebsite();
  };

  useEffect(() => {
    if (websiteData) {
      setSiteName(websiteData.name || "");
      setSiteUrl(websiteData.url || "");
      setToken(websiteData.token || "");
      setRoutes(websiteData.routes || []);
    } else {
      setSiteName("");
      setSiteUrl("");
      setToken("");
      setRoutes([]);
    }
  }, [websiteData]);

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader
        onClose={() => setModalInfo(false)}
        title={
          isEditing
            ? t("modalWebsites.editSite")
            : t("modalWebsites.registerSite")
        }
      />
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("modalWebsites.nameSite")}
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("modalWebsites.urlSite")}
          </label>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("modalWebsites.token")}
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          {routes.length === 0 && (
            <Button
              onClick={handleAddRoute}
              className="my-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              {t("modalWebsites.addRoute")}
            </Button>
          )}
          {routes.length > 0 && (
            <label className="block text-sm font-medium text-gray-700">
              {t("modalWebsites.routes")}
            </label>
          )}
          {routes.map((route, index) => (
            <div key={index} className="space-y-2 mt-2 border p-2 rounded-md">
              <div className="flex items-center space-x-4">
                <select
                  value={route.method}
                  onChange={(e) =>
                    handleRouteChange(index, "method", e.target.value)
                  }
                  className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={route.route}
                  onChange={(e) =>
                    handleRouteChange(index, "route", e.target.value)
                  }
                  className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                  placeholder={`Rota ${index + 1}`}
                />
                {websiteData !== null ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteRoute(route.uuid)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaRegTrashAlt />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemoveRoute(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaRegTrashAlt />
                  </button>
                )}
              </div>
              {(route.method === "POST" || route.method === "PUT") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Body (JSON)
                  </label>
                  <textarea
                    value={route.body}
                    onChange={(e) =>
                      handleRouteChange(index, "body", e.target.value)
                    }
                    className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                    placeholder="Body da requisição"
                  />
                </div>
              )}
            </div>
          ))}

          {routes.length > 0 && (
            <Button
              type="button"
              onClick={handleAddRoute}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              {t("modalWebsites.addAnotherRoute")}
            </Button>
          )}
        </div>
        <div className="flex justify-end items-center space-x-4">
          {websiteData !== null && (
            <Button
              onClick={handleDeleteWebsites}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
            >
              {t("modalWebsites.removeWebsite")}
            </Button>
          )}
          <Button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
          >
            {websiteData !== null
              ? t("modalWebsites.update")
              : t("modalWebsites.register")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
