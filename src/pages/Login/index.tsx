import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { z, ZodSchema } from "zod";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { ModalSendEmail } from "../../components/ModalSendEmail";
import { Button } from "../../components/Button";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import loginImg from "@/assets/images/login.png";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signInByEmail, isAuthenticated, signInByGoogle } =
    useContext(AuthContext);
  const [modalInfo, setModalInfo] = useState(false);
  const { t } = useTranslation();

  const emailSchema = z.string().email({ message: t("login.invalidEmail") });
  const passwordSchema = z
    .string()
    .min(8, { message: t("login.passwordMinLength") });

  const handleModalInfo = () => setModalInfo(true);

  const handleInputChange =
    (
      setter: Dispatch<SetStateAction<string>>,
      schema: ZodSchema,
      setError: Dispatch<SetStateAction<string>>
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      try {
        schema.parse(value);
        setError("");
      } catch (error) {
        if (error instanceof z.ZodError) setError(error.errors[0].message);
      }
    };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await signInByGoogle(tokenResponse.access_token);
        navigate("/home");
      } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let valid = true;

    try {
      emailSchema.parse(email);
      setEmailError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      valid = false;
    }
    try {
      passwordSchema.parse(password);
      setPasswordError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
      }
      valid = false;
    }
    if (valid) {
      await signInByEmail(email, password);
      navigate("/home");
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className="flex min-h-screen w-full justify-between items-center bg-theme-bg">
      <div className="flex flex-row h-full gap-4 items-center justify-center bg-theme-bg w-full">
        <div className="flex lg:w-1/2 justify-center items-center">
          <div className="p-10 rounded-md sm:border bg-white">
            <div className="text-center text-2xl lg:text-4xl font-bold">
              {t("login.accessAccount")}
            </div>
            <div className="mt-3 text-sm">{t("login.welcomeBack")}</div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 items-start justify-start mt-5"
            >
              <label className="text-sm w-auto">{t("login.email")}</label>
              <input
                name="email"
                className="placeholder:text-gray-900 text-gray-900 font-light p-0 text-left text-sm w-full border px-3 py-2 rounded-md"
                type="email"
                value={email}
                onChange={handleInputChange(
                  setEmail,
                  emailSchema,
                  setEmailError
                )}
              />
              {emailError && (
                <div className="text-xs text-red-500">{emailError}</div>
              )}

              <label className="text-sm w-auto">{t("login.password")}</label>
              <div className="relative w-full">
                <input
                  name="password"
                  className="font-light text-left text-sm w-full border px-3 py-2 rounded-md"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange(
                    setPassword,
                    passwordSchema,
                    setPasswordError
                  )}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showPassword ? (
                    <IoEyeOutline
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                      size={20}
                    />
                  ) : (
                    <IoEyeOffOutline
                      onClick={() => setShowPassword(!showPassword)}
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
                  onClick={handleModalInfo}
                >
                  {t("login.forgotPassword")}
                </div>
              </div>
              <Button
                className="cursor-pointer font-semibold mt-1 rounded-lg text-base text-center w-full bg-[#0C346E] text-white hover:opacity-80 py-3"
                type="submit"
              >
                {t("login.loginButton")}
              </Button>
              <div className="items-center flex justify-center text-center w-full gap-3">
                <div className="w-full h-[1px] bg-gray-400" />
                {t("login.or")}
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
                <div className="text-gray-500">
                  {t("login.loginWithGoogle")}
                </div>
              </Button>
            </form>
            <div className="flex flex-row gap-3 items-center justify-center md:w-full mt-5">
              <div className="text-sm">{t("login.noAccount")}</div>
              <div
                className="text-blue-700 font-semibold text-right text-sm cursor-pointer"
                onClick={() => navigate("/register")}
              >
                {t("login.registerNow")}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex animate-fadeIn">
          <img src={loginImg} alt="" />
        </div>
      </div>

      <ModalSendEmail modalInfo={modalInfo} setModalInfo={setModalInfo} />
    </main>
  );
}
