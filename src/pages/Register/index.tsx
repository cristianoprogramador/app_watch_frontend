// src\pages\Register\index.tsx

import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContext";
import InputMask from "react-input-mask";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface ApiResponse {
  message: string;
}

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [typeDocument, setTypeDocument] = useState<string>("CPF");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [documentError, setDocumentError] = useState<string>("");
  const { t } = useTranslation();

  const { isAuthenticated, registerNewUser } = useContext(AuthContext);

  const nameSchema = z
    .string()
    .min(3, { message: t("register.minNameLength") })
    .max(30, { message: t("register.maxNameLength") });
  const emailSchema = z.string().email({ message: t("register.invalidEmail") });
  const passwordSchema = z
    .string()
    .min(8, { message: t("register.passwordMinLength") });

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
      nameSchema.parse(name);
      setNameError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(
          error.errors.find((e) => e.path.includes("name"))?.message ||
            t("register.invalidName")
        );
      }
      valid = false;
    }
    try {
      emailSchema.parse(email);
      setEmailError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(
          error.errors.find((e) => e.path.includes("email"))?.message ||
            t("register.invalidEmail")
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
            t("register.passwordMinLength")
        );
      }
      valid = false;
    }

    if (!document.trim()) {
      setDocumentError(t("register.emptyDocument"));
      valid = false;
    } else {
      setDocumentError("");
    }

    if (valid) {
      try {
        const type = "client";
        registerNewUser(email, password, name, type, typeDocument, document);
        // navigate("/home");
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as { response?: { data?: ApiResponse } };
          toast.error(
            `${t("register.userRegistrationError")}${
              axiosError?.response?.data?.message
            }`
          );
        } else {
          toast.error(t("register.userRegistrationError"));
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
    <main className="flex min-h-screen w-full justify-between items-center bg-theme-bg">
      <div className="flex flex-row h-full items-center justify-center bg-theme-bg w-full">
        <div className="flex lg:w-1/2 justify-center items-center">
          <div className="p-10 rounded-md sm:border bg-white">
            <div className="text-center text-xl lg:text-2xl font-bold">
              {t("register.fillForm")}
            </div>
            <div className="mt-3 text-sm text-center italic">
              {t("register.fillAllFields")}
            </div>
            <form className="grid grid-cols-2 gap-2 items-center justify-start mt-3">
              <label className="text-sm w-auto">{t("register.name")}</label>
              <div>
                <input
                  name="name"
                  className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                />
                {nameError && (
                  <div className="text-xs text-red-500">{nameError}</div>
                )}
              </div>

              <label className="text-sm w-auto">{t("register.email")}</label>

              <div>
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
              </div>

              <label className="text-sm w-auto">{t("register.password")}</label>
              <div>
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
              </div>
              <label className="text-sm w-auto">
                {t("register.typeDocument")}
              </label>
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

              <label className="text-sm w-auto">{t("register.document")}</label>

              <div>
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
                  <div className="text-xs text-red-500">{documentError}</div>
                )}
              </div>
            </form>
            <button
              className="cursor-pointer font-semibold mt-7 rounded-lg text-base text-center w-full bg-[#0C346E] text-white hover:opacity-80 py-3"
              onClick={handleSubmit}
            >
              {t("register.registerUser")}
            </button>
            <div className="flex flex-row gap-3 items-center justify-center md:w-full mt-3">
              <div className="text-sm ">{t("register.alreadyHaveAccount")}</div>
              <div
                className="text-blue-700 font-semibold text-right text-sm cursor-pointer"
                onClick={() => navigate("/login")}
              >
                {t("register.loginNow")}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex animate-fadeIn">
          <img
            src="public/images/register.png"
            alt=""
            style={{
              width: "100%",
              height: "80vh",
              maxHeight: 400,
            }}
          />
        </div>
      </div>
    </main>
  );
}
