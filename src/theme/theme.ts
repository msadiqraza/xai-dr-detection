import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Example primary color
    },
    secondary: {
      main: "#dc004e", // Example secondary color
    },
    background: {
      default: "#f4f6f8", // Light grey background
      paper: "#ffffff",
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
    // Add other typography customizations if needed
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.875rem", // Slightly larger tooltip text
        },
      },
    },
  },
  // Add other theme customizations like spacing, breakpoints, etc.
});

export default theme;
