// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from "react";
import { fetchHistory, HistoryEntry, getChipColor } from "../services/api"; // Import necessary items
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import { format } from "date-fns"; // For formatting dates nicely

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHistory();
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

  const formatDate = (dateString: string) => {
    try {
      // Example format: "October 26, 2023, 09:30 AM"
      return format(new Date(dateString), "PPpp");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Analysis History
      </Typography>

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

      {!loading && !error && history.length > 0 && (
        <List disablePadding>
          {history.map((entry, index) => (
            <React.Fragment key={entry.id}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                {" "}
                {/* Add vertical padding */}
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ fontWeight: "medium" }}
                    >
                      Image:{" "}
                      <Typography component="span" color="text.secondary">
                        {entry.imageName}
                      </Typography>
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "block", mt: 0.5 }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Date: {formatDate(entry.date)}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ mr: 1 }}
                        >
                          {" "}
                          Prediction:{" "}
                        </Typography>
                        <Tooltip
                          title={`Prediction: ${
                            entry.prediction
                          } | Confidence: ${Math.round(
                            entry.confidence * 100
                          )}%`}
                        >
                          <Chip
                            label={`${entry.prediction} (${Math.round(
                              entry.confidence * 100
                            )}%)`}
                            color={getChipColor(entry.prediction)}
                            size="small"
                          />
                        </Tooltip>
                      </Box>
                    </>
                  }
                />
                {/* Optional: Add a button/icon here to view details if needed later */}
                {/* <ListItemSecondaryAction>...</ListItemSecondaryAction> */}
              </ListItem>
              {/* Add divider except for the last item */}
              {index < history.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default HistoryPage;
