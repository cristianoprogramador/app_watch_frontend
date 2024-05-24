import React, { Suspense, useContext } from "react";
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

export function ProjectRoutes() {
  // const { user, isAuthenticated } = useContext(AuthContext);
  const isAuthenticated = true;

  const MainLayoutWrapper = () => {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/" element={<Login />} />

          {isAuthenticated && (
            <>
              <Route element={<MainLayoutWrapper />}>
                <Route path="/home" element={<Home />} />
              </Route>

              <Route element={<MainLayoutWrapper />}>
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route element={<MainLayoutWrapper />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </>
          )}
        </Routes>
      </Router>
    </Suspense>
  );
}
