import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { api } from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import { ProjectsData, Website } from "../../types/website-routes";
import io from "socket.io-client";
import { ModalWebsite } from "../../components/ModalWebsite";

export function Home() {
  const { user } = useContext(AuthContext);

  const [modalInfo, setModalInfo] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);

  const [actualPage, setActualPage] = useState<number>(1);
  const [totalPerPage, setTotalPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Online":
        return "border-green-600 text-green-600 hover:bg-green-200";
      case "Offline":
        return "border-red-600 text-red-600 hover:bg-red-200";
      case "Warning":
        return "border-yellow-600 text-yellow-600 hover:bg-yellow-200";
      case "Loading":
        return "border-orange-600 text-orange-600 hover:bg-orange-200";
      default:
        return "";
    }
  };

  const handleModalInfo = (website: Website | null = null) => {
    setCurrentWebsite(website);
    setModalInfo(true);
  };

  const handleAddNewSite = () => {
    setCurrentWebsite(null);
    setModalInfo(true);
  };

  async function fetchProjects() {
    try {
      const response = await api.get(
        `/website-monitoring/user/${user?.uuid}?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchTerm ? `&search=${searchTerm}` : "")
      );
      console.log(response.data);
      setProjectsData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const updateSiteStatus = (update: { siteUuid: string; status: string }) => {
    setProjectsData((currentData) => {
      if (!currentData) return null;
      const updatedWebsites = currentData.websites.map((site) => {
        if (site.uuid === update.siteUuid) {
          return {
            ...site,
            siteStatus: {
              ...site.siteStatus,
              status: update.status,
            },
          };
        }
        return site;
      });
      return { ...currentData, websites: updatedWebsites };
    });
  };

  useEffect(() => {
    fetchProjects();
    const socket = io(import.meta.env.VITE_API_URL, {
      query: { userId: user?.uuid },
    });

    socket.on("statusUpdate", updateSiteStatus);

    return () => {
      socket.disconnect();
    };
  }, [user?.uuid]);

  return (
    <div className="p-3">
      <div className="flex justify-end gap-5">
        <div className="p-3 flex flex-row gap-1 border bg-gray-200 rounded-md">
          <div>Total de Projetos :</div>
          <div className="font-semibold text-base">({projectsData?.total})</div>
        </div>
        <div className="flex justify-center items-center text-center">
          <Button
            onClick={handleAddNewSite}
            className="h-14 w-32 bg-blue-500 hover:bg-blue-700 rounded-lg text-white border flex justify-center items-center text-center cursor-pointer"
          >
            Adicionar Site
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 justify-center items-center">
        {projectsData?.websites.map((site: Website) => (
          <div
            key={site.uuid}
            className="flex flex-col justify-between w-[400px] border bg-gray-200 rounded-md p-3 m-2 cursor-pointer"
            onClick={() => handleModalInfo(site)}
          >
            <div className="flex flex-row justify-between gap-6">
              <div className="flex flex-col gap-1">
                <div>{site.name}</div>
                <a
                  className="italic hover:text-blue-700"
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.url}
                </a>
              </div>
              <div
                className={`p-2 border ${getStatusClass(
                  "Online"
                )} flex text-center items-center h-10 rounded-md cursor-pointer`}
              >
                {site.siteStatus.status}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-4">
              <div className="flex flex-col gap-1">
                <div>Rotas Cadastradas</div>
                <div className="p-4 border border-gray-500 rounded-md text-center">
                  {site.routes.length}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Rotas Funcionando</div>
                <div className="p-4 border border-gray-500 rounded-md text-center">
                  0 {/* Atualize esta lógica conforme necessário no futuro */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalWebsite
        modalInfo={modalInfo}
        setModalInfo={setModalInfo}
        user={user}
        websiteData={currentWebsite}
        fetchProjects={fetchProjects}
      />
    </div>
  );
}
