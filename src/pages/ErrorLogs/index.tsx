import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { api } from "../../utils/api";

interface ErrorLog {
  uuid: string;
  statusCode: number;
  error: string;
  message: string;
  url: string;
  method: string;
  createdAt: string;
}

export function ErrorLogs() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);

  const [actualPage, setActualPage] = useState<number>(1);
  const [totalPerPage, setTotalPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [totalLogs, setTotalLogs] = useState<number>(0);

  const { t } = useTranslation();

  async function fetchErrorLogs() {
    setLoading(true);
    try {
      const response = await api.get(
        `/errorLogs/list?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchQuery ? `&search=${searchQuery}` : "")
      );
      setErrorLogs(response.data.errorLogs);
      setTotalLogs(response.data.total);
    } catch (error) {
      console.error("Failed to fetch error logs:", error);
    } finally {
      setLoading(false);
    }
  }

  console.log(errorLogs);

  const totalPages = Math.ceil(totalLogs / totalPerPage);

  const handleSearch = () => {
    setActualPage(1);
    setSearchQuery(searchTerm);
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [actualPage, totalPerPage, searchQuery]);

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-full">
      <div className="w-[90%] bg-gray-200 flex flex-col justify-center items-center border rounded-lg h-[80%]">
        {!loading ? (
          <div className="px-4 h-full w-full flex flex-col">
            <div className="text-center py-5 font-semibold text-xl text-gray-800">
            {t("errorLogs.title")}
            </div>
            <div className="mb-4 flex items-center justify-start w-full">
              <input
                type="text"
                placeholder={t("errorLogs.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                {t("errorLogs.searchButton")}
              </button>
            </div>
            <div className="overflow-y-auto flex-1 w-full border rounded-md">
              <table className="min-w-full divide-y  divide-gray-200 ">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-xs text-center font-medium text-gray-500 uppercase">
                    <th className="px-6 py-3">{t("errorLogs.statusCode")}</th>
                    <th className="px-6 py-3">{t("errorLogs.error")}</th>
                    <th className="px-6 py-3">{t("errorLogs.message")}</th>
                    <th className="px-6 py-3">{t("errorLogs.url")}</th>
                    <th className="px-6 py-3">{t("errorLogs.method")}</th>
                    <th className="px-6 py-3">{t("errorLogs.createdAt")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {errorLogs.map((log) => (
                    <tr key={log.uuid} className="text-sm text-center">
                      <td>{log.statusCode}</td>
                      <td>{log.error}</td>
                      <td>
                        {log.message.length > 200
                          ? `${log.message.slice(0, 200)}...`
                          : log.message}
                      </td>
                      <td>{log.url}</td>
                      <td>{log.method}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                {t("errorLogs.total")}: {totalLogs}
              </div>
              <div className="flex items-center">
                <span className="mr-2">{t("errorLogs.itemsPerPage")}:</span>
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
                  {t("errorLogs.previous")}
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
                  {t("errorLogs.next")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
