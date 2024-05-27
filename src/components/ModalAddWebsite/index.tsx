import { SetStateAction, useState } from "react";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { FaRegTrashAlt } from "react-icons/fa";

interface ModalAddWebsiteProps {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
}

interface Route {
  method: string;
  route: string;
  body: string;
}

export const ModalAddWebsite = ({
  modalInfo,
  setModalInfo,
}: ModalAddWebsiteProps) => {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [token, setToken] = useState("");
  const [routes, setRoutes] = useState<Route[]>([
    { method: "GET", route: "", body: "" },
  ]);

  const handleAddRoute = () => {
    setRoutes([
      ...routes,
      { method: "GET", route: "", body: "" },
    ]);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ siteName, siteUrl, token, routes });
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
          <button
            type="button"
            onClick={handleAddRoute}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar outra rota
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </Modal>
  );
};
