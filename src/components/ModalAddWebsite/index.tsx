import { SetStateAction, useState } from "react";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { FaRegTrashAlt } from "react-icons/fa";
import axiosInstance, { api } from "../../utils/api";
import { Button } from "../Button";
import { UserDataDto } from "../../contexts/AuthContext";

interface ModalAddWebsiteProps {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
  user: UserDataDto | null;
}

interface Route {
  method: string;
  route: string;
  body: string;
}

const statusMessages = {
  checking: { message: "Verificando...", className: "text-sm" },
  online: { message: "Site está online", className: "text-green-500 text-sm" },
  offline: { message: "Site está offline", className: "text-red-500 text-sm" },
};

export const ModalAddWebsite = ({
  modalInfo,
  setModalInfo,
  user,
}: ModalAddWebsiteProps) => {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [token, setToken] = useState("");
  const [routes, setRoutes] = useState<Route[]>([
    { method: "GET", route: "", body: "" },
  ]);
  const [siteStatus, setSiteStatus] = useState<
    "checking" | "online" | "offline" | ""
  >("");

  const handleAddRoute = () => {
    setRoutes([...routes, { method: "GET", route: "", body: "" }]);
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

  // const checkSiteStatus = async () => {
  //   setSiteStatus("checking");
  //   try {
  //     const response = await axiosInstance.get("/website-monitoring/check", {
  //       params: {
  //         url: siteUrl,
  //         token: token || undefined, // Só passa o token se ele existir
  //       },
  //     });
  //     const result = response.data;
  //     setSiteStatus(result.status);
  //   } catch (error) {
  //     setSiteStatus("offline");
  //   }
  // };

  const handleAddWebsite = async () => {
    try {
      const response = await api.post("/website-monitoring", {
        siteName: siteName,
        siteUrl: siteUrl,
        token: token,
        routes: routes,
        userId: user?.uuid,
      });
      const result = response.data;
      console.log(result);
      setModalInfo(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddWebsite();
  };

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader onClose={() => setModalInfo(false)} title="Cadastrar Site" />
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Site
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
            URL do Site
          </label>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
            required
          />
          {siteStatus && (
            <div className={statusMessages[siteStatus].className}>
              {statusMessages[siteStatus].message}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Token de Autorização (opcional)
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rotas
          </label>
          {routes.map((route, index) => (
            <div key={index} className="space-y-2 mt-2 border p-2 rounded-md">
              <div className="flex items-center space-x-4">
                <select
                  value={route.method}
                  onChange={(e) =>
                    handleRouteChange(index, "method", e.target.value)
                  }
                  className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                  required
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
                  required
                />
                {index > 0 && (
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
          <Button
            type="button"
            onClick={handleAddRoute}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar outra rota
          </Button>
        </div>
        <div className="flex justify-end items-center space-x-4">
          <Button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
