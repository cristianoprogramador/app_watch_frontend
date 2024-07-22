import { Suspense, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { MainLayout } from "./components/MainLayout";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { AuthContext } from "./contexts/AuthContext";
import { Register } from "./pages/Register";
import { RecoverPassword } from "./pages/RecoverPassword";
import { ErrorLogs } from "./pages/ErrorLogs";
import { Users } from "./pages/Users";
import { Websites } from "./pages/Websites";
import { RoutesPage } from "./pages/Routes";

function PrivateRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

function AdminRoute() {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.type !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export function ProjectRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/errorLogs" element={<ErrorLogs />} />
            <Route path="/websites" element={<Websites />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
