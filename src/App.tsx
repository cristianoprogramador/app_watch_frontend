import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProjectRoutes } from "./Router";

export function App() {
  return (
    <>
      <ProjectRoutes />
      <ToastContainer position="top-right" />
    </>
  );
}
