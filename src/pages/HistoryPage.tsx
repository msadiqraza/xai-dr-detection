// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchHistory, HistoryEntry, getChipColor } from "../services/api"; // Path updated
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
// ListItem removed as we use ListItemButton now for the whole item
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import ListItemButton from "@mui/material/ListItemButton"; // Import ListItemButton
import ListItemText from "@mui/material/ListItemText"; // Keep ListItemText
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Icon for indication
import { format } from "date-fns";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHistory();
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setHistory(data);
      } catch (err: any) {
        console.error("Failed to fetch history:", err);
        setError(err.message || "Could not load analysis history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []); // Empty dependency array means run once on mount

  const handleViewDetails = (id: string) => {
    navigate(`/results/${id}`); // Navigate to results page with history ID
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp"); // e.g., "Oct 26, 2023, 9:30:15 AM"
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>
        {" "}
        Analysis History{" "}
      </Typography>

      {/* === RESTORED CONDITIONAL RENDERING === */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading history...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && history.length === 0 && (
        <Typography sx={{ my: 3, textAlign: "center" }}>
          No analysis history found.
        </Typography>
      )}
      {/* ====================================== */}

      {!loading && !error && history.length > 0 && (
        <List
          component="nav"
          aria-label="analysis history"
          sx={{ bgcolor: "background.paper" }}
        >
          {history.map((entry, index) => (
            <React.Fragment key={entry.id}>
              <Tooltip title="View Analysis Details" placement="left">
                <ListItemButton
                  onClick={() => handleViewDetails(entry.id)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        component="span"
                        sx={{ fontWeight: "medium" }}
                      >
                        {entry.imageName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "block", mt: 0.5 }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Analyzed on: {formatDate(entry.date)}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Chip
                            label={`${entry.prediction} (${Math.round(
                              entry.confidence * 100
                            )}%)`}
                            color={getChipColor(entry.prediction)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            (ID: {entry.id})
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              </Tooltip>
              {index < history.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default HistoryPage;
