// src/components/SidePanel.tsx
import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar"; // Import Toolbar
import Typography from "@mui/material/Typography"; // Import Typography
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box"; // Import Box for potential logo layout
// Icons... (keep existing icon imports)
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Example icon for branding
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface SidePanelProps {
  drawerWidth: number;
  open: boolean;
  onToggle: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  drawerWidth,
  open,
  onToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && open) {
      onToggle();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "History", icon: <HistoryIcon />, path: "/history" },
  ];

  const drawerContent = (
    <div>
      {/* === New Header Section === */}
      <Toolbar
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          minHeight: "64px", // Ensure consistent height
        }}
      >
        <VisibilityIcon sx={{ fontSize: "2rem" }} />
      </Toolbar>
      {/* === End Header Section === */}
      {/* Divider is likely not needed if the Toolbar has a background color */}
      {/* <Divider /> */}
      {/* Adjust paddingTop if needed, though Toolbar should handle the space */}
      <List sx={{ paddingTop: 1 }}>
        {" "}
        {/* Add a little top padding to the list */}
        {menuItems.map((item) => (
          <Tooltip title={item.text} placement="right" key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{ py: 1.2 }} // Slightly increase vertical padding for list items
              >
                <ListItemIcon
                  sx={{ minWidth: "40px" /* Adjust icon spacing */ }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider sx={{ my: 1 }} /> {/* Add margin to divider */}
      <List sx={{ paddingTop: 0 }}>
        <Tooltip title="Logout" placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ py: 1.2 }}>
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </div>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          // Optional: Add a subtle border if needed
          // borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
      ModalProps={isMobile ? { keepMounted: true } : {}}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidePanel;
