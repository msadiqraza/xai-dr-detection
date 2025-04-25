import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ResultsPage from "../pages/ResultsPage";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route: Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Protected Routes within MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          {/* Add other protected routes here, e.g., History */}
          <Route
            path="/history"
            element={<div>History Page (Placeholder)</div>}
          />{" "}
          {/* Placeholder */}
        </Route>
      </Route>

      {/* Fallback Route (Optional: Redirect to login or home based on auth) */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
