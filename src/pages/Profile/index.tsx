import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Button } from "../../components/Button";
import { api } from "../../utils/api";
import InputMask from "react-input-mask";
import { z } from "zod";
import { useTranslation } from "react-i18next";

interface UserDetailsProps {
  typeDocument: string;
  document: string;
  name: string;
}

interface ApiResponse {
  message: string;
}

export function Profile() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserDetailsProps>();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [typeDocument, setTypeDocument] = useState("CPF");

  const [nameError, setNameError] = useState<string>("");
  const { t } = useTranslation();

  const nameSchema = z
    .string()
    .min(3, { message: t("profile.minNameLength") })
    .max(30, { message: t("profile.maxNameLength") });

  async function fetchUserData() {
    setLoading(true);
    try {
      const response = await api.get(`/userDetails/${user?.userDetails.uuid}`);
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    try {
      nameSchema.parse(newName);
      setNameError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0].message);
      }
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let valid = true;

    try {
      nameSchema.parse(name);
      setNameError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(
          error.errors.find((e) => e.path.includes("name"))?.message ||
            "Nome inválido"
        );
      }
      valid = false;
    }

    if (valid) {
      try {
        await api.put(`/userDetails/${user?.userDetails.uuid}`, {
          name,
          typeDocument,
          document,
        });
        window.location.reload();
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as { response?: { data?: ApiResponse } };
          alert(
            `Erro ao registrar usuário: ${axiosError?.response?.data?.message}`
          );
        } else {
          alert("Erro desconhecido ao registrar usuário.");
        }
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setDocument(userData.document);
      setTypeDocument(userData.typeDocument || "CPF");
    }
  }, [userData]);

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-full">
      <div className="w-[50%] bg-gray-200 flex flex-col justify-center items-center border rounded-lg">
        {!loading ? (
          <div className="w-[90%] px-4">
            <div className="text-center py-5 font-semibold text-xl text-gray-800">
              {t("profile.profileInfo")}
            </div>
            <form>
              <div className="flex flex-col gap-2 py-5">
                <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4 items-center">
                  <div>{t("profile.name")}</div>
                  <div>
                    <input
                      name="name"
                      className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-36 border px-3 py-2 rounded-md bg-transparent border-gray-400"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                    />
                    {nameError && (
                      <div className="text-xs text-red-500">{nameError}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4">
                  <div>{t("profile.email")}</div>
                  <div>{user?.email}</div>
                </div>
                <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4 items-center">
                  <div>{t("profile.document")}</div>
                  <select
                    name="typeDocument"
                    className="font-light p-0 text-left text-sm w-36 border px-3 py-2 rounded-md bg-transparent border-gray-400"
                    value={typeDocument}
                    onChange={(e) => setTypeDocument(e.target.value)}
                    required
                  >
                    <option value="CPF">{t("profile.cpf")}</option>
                    <option value="CNPJ">{t("profile.cnpj")}</option>
                  </select>
                </div>
                <div className="flex flex-row justify-between w-full border border-gray-500 rounded-lg p-4 items-center">
                  <div>{t("profile.docNumber")}</div>
                  <InputMask
                    mask={
                      typeDocument === "CPF"
                        ? "999.999.999-99"
                        : "99.999.999/9999-99"
                    }
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-36 border px-3 py-2 rounded-md bg-transparent border-gray-400"
                    required
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  className="px-4 py-2 mt-5 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                  {t("profile.update")}
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
