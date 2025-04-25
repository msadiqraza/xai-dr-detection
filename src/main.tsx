import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme.ts"; // Import your theme
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css"; // Keep or empty this file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent baseline styles */}
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* Wrap App with AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
