import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { ModalAddWebsite } from "../../components/ModalAddWebsite";
import { api } from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import { ProjectsData, Website } from "../../types/website-routes";

interface SiteData {
  name: string;
  url: string;
  registeredRoutes: number;
  workingRoutes: number;
  status: "Online" | "Offline" | "Warning";
}

export function Home() {
  const { user } = useContext(AuthContext);

  const [modalInfo, setModalInfo] = useState(false);
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
      default:
        return "";
    }
  };

  const handleModalInfo = () => {
    setModalInfo(true);
  };

  async function fetchProjects() {
    try {
      const response = await api.get(
        `/website-monitoring/user/${user?.uuid}?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchTerm ? `&search=${searchTerm}` : "")
      );
      const result = response.data;
      setProjectsData(result);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-3">
      <div className="flex justify-end">
        <div className="p-3 flex flex-row gap-1 border rounded-md">
          <div>Total de Projetos :</div>
          <div className="font-semibold text-base">({projectsData?.total})</div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {projectsData?.websites.map((site: Website) => (
          <div
            key={site.uuid}
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
                  "Online"
                )} flex text-center items-center h-10 rounded-md cursor-pointer`}
              >
                Online
              </div>
            </div>
            <div className="flex flex-row justify-between mt-4">
              <div className="flex flex-col gap-1">
                <div>Rotas Cadastradas</div>
                <div className="p-4 border rounded-md text-center">
                  {site.routes.length}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Rotas Funcionando</div>
                <div className="p-4 border rounded-md text-center">
                  0 {/* Atualize esta lógica conforme necessário no futuro */}
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

        <ModalAddWebsite
          modalInfo={modalInfo}
          setModalInfo={setModalInfo}
          user={user}
        />
      </div>
    </div>
  );
}
