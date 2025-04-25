// src/layouts/MainLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton"; // Re-import
import MenuIcon from "@mui/icons-material/Menu"; // Re-import
import Tooltip from "@mui/material/Tooltip"; // Re-import if removed
import SidePanel from "../components/SidePanel";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Keep state here
  const theme = useTheme();

  const handleDrawerToggle = () => {
    // Keep handler here
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)`,
            marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
          },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: isDrawerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* == Add the button back here == */}
          <Tooltip title={isDrawerOpen ? "Close Menu" : "Open Menu"}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle} // Use the handler from this component
              sx={{ mr: 2 }} // Add margin-right for spacing
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          {/* ============================== */}

          <Typography variant="h6" noWrap component="div">
            Diabetic Retinopathy Analysis
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Pass drawer state and width, but NOT the toggle handler directly */}
      {/* SidePanel will use its props for variant logic and internal behavior */}
      <SidePanel
        drawerWidth={drawerWidth}
        open={isDrawerOpen}
        // We pass onToggle for the *mobile* backdrop/nav close functionality
        onToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          mt: { sm: "64px", xs: "56px" },
          [theme.breakpoints.up("sm")]: {
            marginLeft: 0,
            width: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)`,
          },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: isDrawerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
