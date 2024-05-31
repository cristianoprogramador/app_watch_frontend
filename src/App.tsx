import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProjectRoutes } from "./Router";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID || ""}>
        <ProjectRoutes />
        <ToastContainer position="top-right" />
      </GoogleOAuthProvider>
    </>
  );
}
