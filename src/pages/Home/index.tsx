import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { api } from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import { ProjectsData, Website } from "../../types/website-routes";
import io from "socket.io-client";
import { ModalWebsite } from "../../components/ModalWebsite";
import { useTranslation } from "react-i18next";
import { RxUpdate } from "react-icons/rx";

export function Home() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
  const [updatingSiteId, setUpdatingSiteId] = useState<string | null>(null);

  const [actualPage] = useState<number>(1);
  const [totalPerPage] = useState<number>(10);
  const [searchTerm] = useState("");
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const { t } = useTranslation();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "online":
        return "border-green-600 text-green-600 hover:bg-green-200";
      case "offline":
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
    setLoading(true);
    try {
      const response = await api.get(
        `/website-monitoring/user/${user?.uuid}?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchTerm ? `&search=${searchTerm}` : "")
      );
      // console.log(response.data);
      setProjectsData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateSiteStatus = async (
    siteId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setUpdatingSiteId(siteId);
    try {
      await api.post(`/website-monitoring/update-status/${siteId}`);
      fetchProjects();
    } catch (error) {
      console.error("Failed to update site status", error);
    } finally {
      setUpdatingSiteId(null);
    }
  };

  const updateSiteStatus = (update: {
    siteUuid: string;
    status: string;
    routes: Array<{
      routeId: string;
      route: string;
      status: string;
      response: string;
    }>;
  }) => {
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
            routes: site.routes.map((route) => {
              const updatedRoute =
                update.routes && Array.isArray(update.routes)
                  ? update.routes.find((r) => r.routeId === route.uuid)
                  : undefined;
              if (updatedRoute) {
                return {
                  ...route,
                  routeStatus: {
                    status: updatedRoute.status,
                    response: updatedRoute.response,
                  },
                };
              }
              return route;
            }),
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
        <div className="p-3 flex flex-row gap-1 items-center bg-theme-bg-card rounded-md">
          <div>{t("home.total")}</div>
          <div className="font-semibold text-base">({projectsData?.total})</div>
        </div>
        <div className="flex justify-center items-center text-center">
          <Button
            onClick={handleAddNewSite}
            className="h-14 w-32 bg-blue-500 hover:bg-blue-700 rounded-lg text-white flex justify-center items-center text-center cursor-pointer"
          >
            {t("home.addSite")}
          </Button>
        </div>
      </div>
      {!loading ? (
        <div className="flex flex-wrap gap-6 mt-4 justify-center items-center">
          {projectsData?.websites.map((site: Website) => (
            <div
              key={site.uuid}
              className="flex flex-col justify-between w-[400px] bg-theme-bg-card rounded-md p-3 m-2 cursor-pointer"
              onClick={() => handleModalInfo(site)}
            >
              <div className="flex flex-row justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2">
                    <div
                      className="cursor-pointer hover:opacity-65"
                      onClick={(e) => handleUpdateSiteStatus(site.uuid, e)}
                    >
                      {updatingSiteId === site.uuid ? (
                        <div className="animate-spin">
                          <RxUpdate size={20} />
                        </div>
                      ) : (
                        <RxUpdate size={20} />
                      )}
                    </div>
                    <div>{site.name}</div>
                  </div>
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
                    site?.siteStatus?.status
                  )} flex text-center items-center h-10 rounded-md cursor-pointer`}
                >
                  {site?.siteStatus?.status}
                </div>
              </div>
              <div className="flex flex-row justify-between mt-4">
                <div className="flex flex-col gap-1">
                  <div>{t("home.routes")}</div>
                  <div className="p-4 border border-gray-500 rounded-md text-center">
                    {site.routes.length}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div>{t("home.routesWorking")}</div>
                  <div className="p-4 border border-gray-500 rounded-md text-center">
                    {
                      site.routes.filter(
                        (route) => route.routeStatus?.status === "success"
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
