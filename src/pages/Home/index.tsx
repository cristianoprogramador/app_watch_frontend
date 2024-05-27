import { useState } from "react";
import { Button } from "../../components/Button";
import Modal from "../../components/Modal";
import ModalHeader from "../../components/ModalHeader";
import { ModalAddWebsite } from "../../components/ModalAddWebsite";

export function Home() {
  interface SiteData {
    name: string;
    url: string;
    registeredRoutes: number;
    workingRoutes: number;
    status: "Online" | "Offline" | "Warning";
  }

  const sites: SiteData[] = [
    {
      name: "Create Burger",
      url: "https://createburger.com.br/",
      registeredRoutes: 5,
      workingRoutes: 5,
      status: "Online",
    },
    {
      name: "Lithá - Pilates e Fisio",
      url: "https://clinicalitha.com.br/",
      registeredRoutes: 2,
      workingRoutes: 0,
      status: "Offline",
    },
    {
      name: "My Life Dashboard",
      url: "https://mylife-dashboard.vercel.app/",
      registeredRoutes: 6,
      workingRoutes: 5,
      status: "Warning",
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Online":
        return "border-green-600 text-green-600 hover:bg-green-200";
      case "Offline":
        return "border-red-600 text-red-600 hover:bg-red-200";
      case "Warning":
        return "border-yellow-600 text-yellow-600 hover:bg-yellow-200";
      default:
        return "";
    }
  };

  const [modalInfo, setModalInfo] = useState(false);

  const handleModalInfo = () => {
    setModalInfo(true);
  };

  return (
    <div className="grid gap-6 p-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {sites.map((site) => (
        <div
          key={site.name}
          className="flex flex-col justify-between border rounded-md p-3 m-2"
        >
          <div className="flex flex-row justify-between gap-6">
            <div className="flex flex-col gap-1">
              <div>{site.name}</div>
              <a
                className="italic"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.url}
              </a>
            </div>
            <div
              className={`p-2 border ${getStatusClass(
                site.status
              )} flex text-center items-center h-10 rounded-md cursor-pointer`}
            >
              {site.status}
            </div>
          </div>
          <div className="flex flex-row justify-between mt-4">
            <div className="flex flex-col gap-1">
              <div>Rotas Cadastradas</div>
              <div className="p-4 border rounded-md text-center">
                {site.registeredRoutes}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div>Rotas Funcionando</div>
              <div className="p-4 border rounded-md text-center">
                {site.workingRoutes}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className=" flex justify-center items-center text-center ">
        <Button
          onClick={() => handleModalInfo()}
          className="h-14 w-32 bg-blue-500 hover:bg-blue-700 rounded-lg text-white border flex justify-center items-center text-center cursor-pointer"
        >
          Adicionar Site
        </Button>
      </div>

      <ModalAddWebsite modalInfo={modalInfo} setModalInfo={setModalInfo} />
    </div>
  );
}
