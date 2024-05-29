// src\pages\RecoverPassword\index.tsx

import { useEffect, useState } from "react";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { api } from "../../utils/api";

const passwordSchema = z
  .string()
  .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
  .regex(/[A-Z]/, { message: "Senha deve conter uma letra maiúscula" });

export function RecoverPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);

  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      alert("Token inválido ou expirado");
      return;
    }

    try {
      passwordSchema.parse(password);
      setPasswordError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
        return;
      }
    }

    if (password !== confirmPassword) {
      setPasswordConfirmError("As senhas não coincidem");
      return;
    } else {
      setPasswordConfirmError("");
    }

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      console.log("token", token, "password", password);
      console.log(response);

      if (response.status === 201) {
        alert("Senha redefinida com sucesso");
        navigate("/login");
      } else {
        alert("Erro ao redefinir senha");
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      alert("Erro ao redefinir senha.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
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

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
    if (newPassword !== password) {
      setPasswordConfirmError("As senhas não coincidem");
    } else {
      setPasswordConfirmError("");
    }
  };

  return (
    <main className="flex min-h-screen w-full justify-between items-center bg-[#FFFFFF]">
      <div className="flex flex-row h-full gap-4 items-center justify-center bg-white w-full">
        <div className="flex lg:w-1/2 justify-center items-center">
          <div className="p-10 rounded-md sm:border">
            <div className=" text-center text-xl lg:text-2xl font-bold">
              Redefine sua senha
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 items-start justify-start mt-6"
            >
              <div className="relative w-full">
                <input
                  name="password"
                  placeholder="Nova senha"
                  className="font-light text-left text-sm w-full border px-3 py-2 rounded-md"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                />
                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
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
              <div className="relative w-full">
                <input
                  name="password"
                  placeholder="Confirme a nova senha"
                  className="font-light text-left text-sm w-full border px-3 py-2 rounded-md"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handlePasswordConfirmChange}
                />
                {passwordConfirmError && (
                  <div className="text-red-500 text-sm">
                    {passwordConfirmError}
                  </div>
                )}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showPasswordConfirm ? (
                    <IoEyeOutline
                      onClick={togglePasswordConfirmVisibility}
                      className="cursor-pointer"
                      size={20}
                    />
                  ) : (
                    <IoEyeOffOutline
                      onClick={togglePasswordConfirmVisibility}
                      className="cursor-pointer"
                      size={20}
                    />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer font-semibold mt-1 rounded-lg text-base text-center w-full bg-[#0C346E] text-white hover:opacity-80 py-3"
              >
                Redefinir Senha
              </button>
            </form>
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
