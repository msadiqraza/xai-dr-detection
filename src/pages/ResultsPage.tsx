// src/pages/ResultsPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Import useParams
import {
  NewAnalysisResult,
  HistoryDetail,
  isHistoryDetail,
  fetchHistoryDetails, // Import history fetch function
  getChipColor,
  saveToHistory, // Import new saveToHistory function
} from "../services/api"; // Path updated
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import ImageModal from "../components/ImageModal";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CircularProgress from "@mui/material/CircularProgress"; // For loading state
import { format } from "date-fns"; // For displaying history date

type ResultData = NewAnalysisResult | HistoryDetail;

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ historyId?: string }>(); // Get URL parameters

  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  // Store the blob URL ref separately for cleanup
  const [blobUrlRef, setBlobUrlRef] = useState<string | null>(null);
  // Track if a new result has been saved to history
  const [savedToHistory, setSavedToHistory] = useState<boolean>(false);
  // Track the ID of the saved history entry for potential redirection
  const [savedHistoryId, setSavedHistoryId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    const historyId = params.historyId;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setBlobUrlRef(null); // Reset blob ref
      setSavedToHistory(false); // Reset saved to history flag

      try {
        let data: ResultData | null = null;

        if (historyId) {
          // --- Fetching History Detail ---
          console.log(`Fetching history details for ID: ${historyId}`);
          data = await fetchHistoryDetails(historyId);
          if (!data && isMounted) {
            throw new Error("History record not found.");
          }
        } else if (location.state && location.state.analysisResult) {
          // --- Using New Analysis Result from State ---
          console.log("Using new analysis result from location state");
          data = location.state.analysisResult as NewAnalysisResult;
          
          // Check if it's a blob URL and store it for cleanup
          if (
            data.originalImageUrl &&
            data.originalImageUrl.startsWith("blob:")
          ) {
            setBlobUrlRef(data.originalImageUrl);
          }

          // Only attempt to save to history once during component lifecycle
          if (data && !historyId && !savedToHistory && location.state?.saveToHistory === true) {
            console.log("Attempting to save analysis to history (one time only)...");
            
            // Mark as saved in component state immediately to prevent duplicates
            setSavedToHistory(true);
            
            // Extract the actual filename from the location state
            const defaultFilename = location.state?.originalFilename || 'fundus_image.jpg';
            const filename = location.state?.filename || defaultFilename;
            console.log("Using filename for history:", filename);
            
            // Get the blob data if available and convert to base64 for permanent storage
            let originalImageForStorage = data.originalImageUrl;
            
            // If this is a new blob URL, we need to convert it to a data URL for storage
            if (data.originalImageUrl && data.originalImageUrl.startsWith('blob:')) {
              try {
                const response = await fetch(data.originalImageUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                
                // Convert blob to base64 data URL
                originalImageForStorage = await new Promise<string>((resolve) => {
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                });
                
                console.log("Converted blob URL to data URL for storage");
              } catch (convError) {
                console.error("Failed to convert blob to data URL:", convError);
                // Continue with the original URL if conversion fails
              }
            }
            
            // Ensure we have all required fields for the history entry
            const historyEntry = {
              ...data,
              prediction: data.prediction,
              confidence: data.confidence,
              explanation: data.explanation,
              gradCamImageUrl: data.gradCamImageUrl,
              imageName: filename,
              originalImageUrl: originalImageForStorage, // Use converted data URL if available
            };
            
            try {
              const historyId = await saveToHistory(historyEntry);
              
              if (historyId && isMounted) {
                console.log(`Analysis saved to history with ID: ${historyId}`);
                setSavedHistoryId(historyId);
                
                // Update state only AFTER successful save to prevent future saves
                navigate(location.pathname, { 
                  replace: true, 
                  state: { 
                    ...location.state,
                    saveToHistory: false,
                  }
                });
              }
            } catch (err) {
              console.error("Failed to save analysis to history:", err);
              // Don't reset savedToHistory - we don't want to retry as that could cause duplicates
            }
          }
        } else {
          // --- No Data Found ---
          if (isMounted) {
            console.warn(
              "No analysis result found in location state or history ID in params. Redirecting."
            );
            navigate("/", { replace: true }); // Redirect if no data source
            return; // Exit early
          }
        }

        if (isMounted && data) {
          setResult(data);
        }
      } catch (err: any) {
        console.error("Error loading results data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load analysis results.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false; // Mark as unmounted
      // Revoke Blob URL only if it was set (i.e., from a new analysis)
      if (blobUrlRef) {
        URL.revokeObjectURL(blobUrlRef);
        console.log(
          "Revoked Blob URL on ResultsPage unmount/reload:",
          blobUrlRef
        );
      }
    };
    // Dependencies: location.state might change, params.historyId might change
    // blobUrlRef is included to ensure cleanup runs if it changes (though it shouldn't mid-render)
  }, [location.state, params.historyId, navigate, blobUrlRef]);

  const handleOpenModal = (imageUrl: string, altText: string) => {
    setModalImage({ url: imageUrl, alt: altText });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Render Loading State
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading analysis results...</Typography>
      </Box>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  // Render No Result State (should ideally be handled by redirect in useEffect)
  if (!result) {
    return <Typography sx={{ m: 3 }}>No analysis data available.</Typography>;
  }

  // Determine if viewing history detail
  const viewingHistory = isHistoryDetail(result);

  // Render Result Content
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        {viewingHistory ? `Analysis Details (History)` : "Analysis Results"}
      </Typography>

      {/* Display Date for History Items */}
      {viewingHistory && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Analyzed on: {formatDate(result.date)} | Image: {result.imageName}
        </Typography>
      )}

      {/* Prediction and Confidence */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* ... (keep prediction/confidence chips - uses getChipColor) ... */}
        <Typography variant="h6" component="span" sx={{ mr: 2 }}>
          {" "}
          Prediction:{" "}
        </Typography>
        <Tooltip title={`Predicted stage: ${result.prediction}`}>
          <Chip
            label={result.prediction}
            color={getChipColor(result.prediction)}
            size="medium"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          />
        </Tooltip>
        <Typography
          variant="h6"
          component="span"
          sx={{ mr: 2, ml: { xs: 0, sm: 3 } }}
        >
          {" "}
          Confidence:{" "}
        </Typography>
        <Tooltip
          title={`Model confidence score: ${Math.round(
            result.confidence * 100
          )}%`}
        >
          <Chip
            label={`${Math.round(result.confidence * 100)}%`}
            variant="outlined"
            size="medium"
          />
        </Tooltip>
        <Tooltip title="This prediction is generated by an AI model...">
          <InfoOutlinedIcon color="action" sx={{ ml: 1, cursor: "help" }} />
        </Tooltip>
      </Paper>

      <Grid container spacing={3}>
        {/* Original Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Tooltip title="Click to view original image larger">
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                onClick={() =>
                  handleOpenModal(
                    result.originalImageUrl,
                    "Original Fundus Image"
                  )
                }
              >
                <CardMedia
                  component="img"
                  height="350"
                  image={result.originalImageUrl}
                  alt="Original Fundus Image"
                  sx={{ objectFit: "contain", p: 1, backgroundColor: "#eee" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {" "}
                    Original Image{" "}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewingHistory
                      ? `Original image from analysis on ${
                          formatDate(result.date).split(",")[0]
                        }.`
                      : "The fundus image uploaded for analysis."}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Tooltip>
        </Grid>

        {/* Grad-CAM Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Tooltip title="Click to view Grad-CAM image larger">
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                onClick={() =>
                  handleOpenModal(
                    result.gradCamImageUrl,
                    "Grad-CAM Highlighted Image"
                  )
                }
              >
                <CardMedia
                  component="img"
                  height="350"
                  image={result.gradCamImageUrl}
                  alt="Grad-CAM Highlighted Image"
                  sx={{ objectFit: "contain", p: 1, backgroundColor: "#eee" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {" "}
                    Highlighted Image (Grad-CAM){" "}
                    <Tooltip title="Gradient-weighted Class Activation Mapping...">
                      <InfoOutlinedIcon
                        color="action"
                        sx={{
                          fontSize: "1rem",
                          ml: 0.5,
                          verticalAlign: "middle",
                          cursor: "help",
                        }}
                      />
                    </Tooltip>{" "}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {" "}
                    Areas influencing the prediction are highlighted.{" "}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Tooltip>
        </Grid>

        {/* NLP Explanation */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {" "}
              Explanation{" "}
              <Tooltip title="This text is generated by an AI...">
                <InfoOutlinedIcon
                  color="action"
                  sx={{
                    fontSize: "1rem",
                    ml: 0.5,
                    verticalAlign: "middle",
                    cursor: "help",
                  }}
                />
              </Tooltip>{" "}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {" "}
              {result.explanation}{" "}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          open={modalOpen}
          onClose={handleCloseModal}
          imageUrl={modalImage.url}
          altText={modalImage.alt}
        />
      )}
    </Box>
  );
};

export default ResultsPage;
