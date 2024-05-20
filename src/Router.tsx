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
            <Route element={<MainLayoutWrapper />}>
              <Route path="/home" element={<Home />} />
            </Route>
          )}
        </Routes>
      </Router>
    </Suspense>
  );
}
