// src/pages/Login/index.tsx

import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { ModalSendEmail } from "../../components/ModalSendEmail";
import { Button } from "../../components/Button";
import { useGoogleLogin } from "@react-oauth/google";

const emailSchema = z.string().email({ message: "E-mail inválido" });
const passwordSchema = z
  .string()
  .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
  .regex(/[A-Z]/, { message: "Senha deve conter uma letra maiúscula" });

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("securePassword!");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const { signInByEmail, isAuthenticated, signInByGoogle } =
    useContext(AuthContext);
  const [modalInfo, setModalInfo] = useState(false);

  const handleModalInfo = () => {
    setModalInfo(true);
  };

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const token = tokenResponse.access_token;
        await signInByGoogle(token);
        navigate("/home");
      } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
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
    if (valid) {
      await signInByEmail(email, password);

      navigate("/home");
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
            <div className=" text-center text-2xl lg:text-4xl font-bold">
              Acesse sua Conta
            </div>
            <div className="mt-3 text-sm">
              Seja bem-vindo, por favor faça login em sua conta.
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 items-start justify-start mt-5"
            >
              <label className="text-sm w-auto">E-mail:</label>
              <input
                name="email"
                className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <div className="text-xs text-red-500">{emailError}</div>
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
                <div className="text-xs text-red-500">{passwordError}</div>
              )}
              <div className="flex flex-row items-center justify-end md:w-full">
                <div
                  className="text-blue-700 font-semibold text-right text-sm cursor-pointer"
                  onClick={() => handleModalInfo()}
                >
                  Esqueceu sua senha?
                </div>
              </div>
              <Button
                className="cursor-pointer font-semibold mt-1 rounded-lg text-base text-center w-full bg-[#0C346E] text-white hover:opacity-80 py-3"
                type="submit"
              >
                Entrar no Sistema
              </Button>
              <div className="items-center flex justify-center text-center w-full gap-3">
                <div className="w-full h-[1px] bg-gray-400" />
                ou
                <div className="w-full h-[1px] bg-gray-400" />
              </div>
              <Button
                className="cursor-pointer font-semibold rounded-lg text-base text-center w-full border border-[#0C346E] hover:opacity-80 py-3 flex items-center justify-center gap-5"
                onClick={(e) => {
                  e.preventDefault();
                  googleLogin();
                }}
              >
                <div>
                  <FcGoogle size={30} />
                </div>
                <div className="text-gray-500">Entre com Google</div>
              </Button>
            </form>
            <div className="flex flex-row gap-3 items-center justify-center md:w-full mt-5">
              <div className="text-sm ">Ainda não tem conta?</div>
              <div
                className="text-blue-700 font-semibold text-right text-sm cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Cadastre-se agora!
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex animate-fadeIn">
          <img src="public/images/login.png" alt="" />
        </div>
      </div>

      <ModalSendEmail modalInfo={modalInfo} setModalInfo={setModalInfo} />
    </main>
  );
}
