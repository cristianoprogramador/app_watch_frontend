import { Suspense, useContext } from "react";
import {
  BrowserRouter as Router,
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

function PrivateRoute() {
  const { user, isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export function ProjectRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
