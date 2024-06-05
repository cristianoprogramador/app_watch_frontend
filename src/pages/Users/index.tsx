import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { api } from "../../utils/api";

interface User {
  uuid: string;
  email: string;
  type: string;
  disabled: boolean;
  createdAt: string;
}

export function Users() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [actualPage, setActualPage] = useState<number>(1);
  const [totalPerPage, setTotalPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const { t } = useTranslation();

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await api.get(
        `/users/list?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchQuery ? `&search=${searchQuery}` : "")
      );
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalUsers / totalPerPage);

  const handleSearch = () => {
    setActualPage(1);
    setSearchQuery(searchTerm);
  };

  useEffect(() => {
    fetchUsers();
  }, [actualPage, totalPerPage, searchQuery]);

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-full">
      <div className="w-[90%] bg-gray-200 flex flex-col justify-center items-center border rounded-lg h-[80%]">
        {!loading ? (
          <div className="px-4 h-full w-full flex flex-col">
            <div className="text-center py-5 font-semibold text-xl text-gray-800">
            {t("users.title")}
            </div>
            <div className="mb-4 flex items-center justify-start w-full">
              <input
                type="text"
                placeholder={t("users.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                {t("users.searchButton")}
              </button>
            </div>
            <div className="overflow-y-auto flex-1 w-full border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-xs text-center font-medium text-gray-500 uppercase">
                    <th className="px-6 py-3">{t("users.uuid")}</th>
                    <th className="px-6 py-3">{t("users.email")}</th>
                    <th className="px-6 py-3">{t("users.type")}</th>
                    <th className="px-6 py-3">{t("users.disabled")}</th>
                    <th className="px-6 py-3">{t("users.createdAt")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.uuid} className="text-sm text-center">
                      <td>{user.uuid}</td>
                      <td>{user.email}</td>
                      <td>{user.type}</td>
                      <td>
                        {user.disabled
                          ? t("users.disabledYes")
                          : t("users.disabledNo")}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                {t("users.total")}: {totalUsers}
              </div>
              <div className="flex items-center">
                <span className="mr-2">{t("users.itemsPerPage")}:</span>
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
                  {t("users.previous")}
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
                  {t("users.next")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
