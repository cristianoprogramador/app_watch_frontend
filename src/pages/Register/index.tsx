// src\pages\Register\index.tsx

import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../utils/api";
import InputMask from "react-input-mask";

const emailSchema = z.string().email({ message: "E-mail inválido" });

const passwordSchema = z
  .string()
  .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
  .regex(/[A-Z]/, { message: "Senha deve conter uma letra maiúscula" });

interface ApiResponse {
  message: string;
}

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("securePassword!");
  const [name, setName] = useState<string>("John Doe");
  const [document, setDocument] = useState<string>("");
  const [typeDocument, setTypeDocument] = useState<string>("CPF");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [documentError, setDocumentError] = useState<string>("");

  const { signInByEmail, isAuthenticated, user } = useContext(AuthContext);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    try {
      emailSchema.parse(newEmail);
      setEmailError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    try {
      passwordSchema.parse(newPassword);
      setPasswordError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
      }
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let valid = true;

    try {
      emailSchema.parse(email);
      setEmailError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(
          error.errors.find((e) => e.path.includes("email"))?.message ||
            "E-mail inválido"
        );
      }
      valid = false;
    }
    try {
      passwordSchema.parse(password);
      setPasswordError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(
          error.errors.find((e) => e.path.includes("password"))?.message ||
            "Erro na senha"
        );
      }
      valid = false;
    }

    if (!document.trim()) {
      setDocumentError("Documento não pode estar vazio");
      valid = false;
    } else {
      setDocumentError("");
    }

    if (valid) {
      const payload = {
        email,
        password,
        name,
        type: "client",
        typeDocument,
        document,
      };
      try {
        console.log(payload);
        const response = await api.post("/auth/register-new-client", payload);
        console.log(response.data);
        // navigate("/login");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="flex min-h-screen w-full justify-between items-center bg-[#FFFFFF]">
      <div className="flex flex-row h-full gap-4 items-center justify-center bg-white w-full">
        <div className="flex lg:w-1/2 justify-center items-center">
          <div className="p-10 rounded-md sm:border">
            <div className=" text-center text-xl lg:text-2xl font-bold">
              Preencha o Formulário
            </div>
            <div className="mt-3 text-sm">
              Por favor preencha todos os campos.
            </div>
            <form className="flex flex-col gap-2 items-start justify-start mt-6">
              <label className="text-sm w-auto">E-mail:</label>
              <input
                name="email"
                className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <div className="text-sm text-red-500">{emailError}</div>
              )}

              <label className="text-sm w-auto">Senha:</label>
              <div className="relative w-full">
                <input
                  name="password"
                  className="font-light text-left text-sm w-full border px-3 py-2 rounded-md"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showPassword ? (
                    <IoEyeOutline
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer"
                      size={20}
                    />
                  ) : (
                    <IoEyeOffOutline
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer"
                      size={20}
                    />
                  )}
                </div>
              </div>
              {passwordError && (
                <div className="text-sm text-red-500">{passwordError}</div>
              )}
              <label className="text-sm w-auto">Tipo de Documento:</label>
              <select
                name="typeDocument"
                className="font-light text-left text-sm w-full border px-3 py-2 rounded-md"
                value={typeDocument}
                onChange={(e) => setTypeDocument(e.target.value)}
                required
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>

              <label className="text-sm w-auto">Documento:</label>
              <InputMask
                mask={
                  typeDocument === "CPF"
                    ? "999.999.999-99"
                    : "99.999.999/9999-99"
                }
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                required
              />
              {documentError && (
                <div className="text-sm text-red-500">{documentError}</div>
              )}
              <button
                className="cursor-pointer font-semibold mt-1 rounded-lg text-base text-center w-full bg-[#0C346E] text-white hover:opacity-80 py-3"
                onClick={handleSubmit}
              >
                Cadastrar Usuário
              </button>
            </form>
            <div className="flex flex-row gap-3 items-center justify-center md:w-full mt-5">
              <div className="text-sm ">Já tem conta?</div>
              <div
                className="text-blue-700 font-semibold text-right text-sm cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Faça o login agora
              </div>
            </div>
          </div>
        </div>

        <div
          className="hidden lg:flex animate-fadeIn"
          style={{
            flex: 1,
            backgroundImage: "url('public/images/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            width: "100%",
            height: "100vh",
          }}
        ></div>
      </div>
    </main>
  );
}
