// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ResultsPage from "../pages/ResultsPage";
import HistoryPage from "../pages/HistoryPage"; // Import HistoryPage
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
          {/* === Add History Route === */}
          <Route path="/history" element={<HistoryPage />} />
          {/* ========================= */}
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
