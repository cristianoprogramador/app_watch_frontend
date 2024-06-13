import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../utils/api";
import { GrDocumentExcel } from "react-icons/gr";
import * as XLSX from "xlsx";

interface User {
  email: string;
}

interface Routes {
  uuid: string;
}

interface WebSite {
  uuid: string;
  name: number;
  url: string;
  user: User;
  routes: Routes[];
  routeCount: number;
  createdAt: string;
}

export function Websites() {
  const [loading, setLoading] = useState(false);
  const [websites, setWebsites] = useState<WebSite[]>([]);

  const [actualPage, setActualPage] = useState<number>(1);
  const [totalPerPage, setTotalPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [totalLogs, setTotalLogs] = useState<number>(0);

  const { t } = useTranslation();

  async function fetchWebsites() {
    setLoading(true);
    try {
      const response = await api.get(
        `/website-monitoring/listAllWebSites?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchQuery ? `&search=${searchQuery}` : "")
      );
      setWebsites(response.data.websites);
      setTotalLogs(response.data.total);
    } catch (error) {
      console.error("Failed to fetch websites:", error);
    } finally {
      setLoading(false);
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(websites);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WebSites");
    XLSX.writeFile(workbook, "websites.xlsx");
  };

  const totalPages = Math.ceil(totalLogs / totalPerPage);

  const handleSearch = () => {
    setActualPage(1);
    setSearchQuery(searchTerm);
  };

  useEffect(() => {
    fetchWebsites();
  }, [actualPage, totalPerPage, searchQuery]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-[90%] bg-gray-200 flex flex-col justify-center items-center border rounded-lg h-[80%]">
        {!loading ? (
          <div className="px-4 h-full w-full flex flex-col">
            <div className="text-center py-5 font-semibold text-xl text-gray-800">
              {t("websites.title")}
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
              <div className="flex flex-row gap-2 min-w-96">
                <input
                  type="text"
                  placeholder={t("websites.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full min-w-md"
                />
                <button
                  onClick={handleSearch}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                  {t("websites.searchButton")}
                </button>
              </div>
              <div className="mr-5 flex flex-row gap-2">
                <GrDocumentExcel
                  size={30}
                  color="darkblue"
                  className="cursor-pointer hover:opacity-60"
                  onClick={exportToExcel}
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 w-full border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-xs text-center font-medium text-gray-500 uppercase">
                    <th className="lg:px-6 lg:py-3">{t("websites.name")}</th>
                    <th className="lg:px-6 lg:py-3">{t("websites.url")}</th>
                    <th className="lg:px-6 lg:py-3">{t("websites.user")}</th>
                    <th className="lg:px-6 lg:py-3">{t("websites.routes")}</th>
                    <th className="lg:px-6 lg:py-3">
                      {t("websites.createdAt")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {websites.map((website) => (
                    <tr key={website.uuid} className="text-xs text-center">
                      <td>{website.name}</td>
                      <td>{website.url}</td>
                      <td>{website.user?.email}</td>
                      <td>{website.routeCount}</td>
                      <td>{new Date(website.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                {t("websites.total")}: {totalLogs}
              </div>
              <div className="flex items-center">
                <span className="mr-2">{t("websites.itemsPerPage")}:</span>
                <select
                  className="border border-gray-300 rounded-md"
                  value={totalPerPage}
                  onChange={(e) => setTotalPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  onClick={() => setActualPage((prev) => Math.max(prev - 1, 1))}
                  disabled={actualPage === 1}
                >
                  {t("websites.previous")}
                </button>
                <span>
                  {actualPage} / {totalPages}
                </span>
                <button
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  onClick={() =>
                    setActualPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={actualPage === totalPages}
                >
                  {t("websites.next")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
