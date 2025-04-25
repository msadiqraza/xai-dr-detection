import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeImage, AnalysisResult } from "../services/api"; // Adjust path
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import LoadingSpinner from "../components/LoadingSpinner"; // Adjust path

const HomePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up Blob URL when component unmounts or preview changes
  useEffect(() => {
    // This is a cleanup function that runs when the component unmounts
    // or before the effect runs again if dependencies change.
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        console.log("Revoked preview Blob URL:", previewUrl);
      }
    };
  }, [previewUrl]); // Dependency array includes previewUrl

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear previous errors
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation (optional: add more checks like file size)
      if (!file.type.startsWith("image/")) {
        setError(
          "Invalid file type. Please upload an image (JPEG, PNG, etc.)."
        );
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        return;
      }
      setSelectedFile(file);
      // Create a preview URL, revoke previous one if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // Call the (mock) API function
      const result: AnalysisResult = await analyzeImage(selectedFile);

      // IMPORTANT: Do NOT revoke the originalImageUrl (blob url from analyzeImage) here.
      // It needs to be passed to the ResultsPage.
      // The ResultsPage will be responsible for displaying and eventually revoking it.

      // Navigate to results page, passing data via state
      navigate("/results", { state: { analysisResult: result } });
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      setError(err.message || "An error occurred during analysis.");
      // Clean up preview if analysis fails and we stay on this page
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Analyze Fundus Image for Diabetic Retinopathy
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        Upload a fundus image (e.g., JPEG, PNG) to predict the stage of Diabetic
        Retinopathy. The system will provide a classification, confidence score,
        a highlighted Grad-CAM image showing areas of interest, and a textual
        explanation.
      </Typography>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" // Accept only image files
        style={{ display: "none" }}
        disabled={isLoading}
      />

      {/* Upload Area / Button */}
      <Tooltip title="Click or drag image here">
        <Box
          sx={{
            border: "2px dashed grey",
            borderRadius: 1,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#f9f9f9",
            transition: "background-color 0.2s ease",
            "&:hover": { backgroundColor: "#eeeeee" },
          }}
          onClick={handleUploadClick}
        >
          <CloudUploadIcon
            sx={{ fontSize: 60, color: "primary.main", mb: 1 }}
          />
          <Typography>
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : "Click or Drag & Drop Image Here"}
          </Typography>
        </Box>
      </Tooltip>

      {/* Image Preview */}
      {previewUrl && (
        <Box
          sx={{
            mt: 2,
            maxWidth: "300px",
            maxHeight: "300px",
            border: "1px solid #ddd",
            padding: "4px",
          }}
        >
          <Typography variant="caption" display="block" gutterBottom>
            Preview:
          </Typography>
          <img
            src={previewUrl}
            alt="Selected Fundus Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ width: "100%", maxWidth: "500px", mt: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {isLoading && <LoadingSpinner message="Analyzing image..." />}

      {/* Submit Button */}
      <Tooltip
        title={
          !selectedFile
            ? "Please select an image first"
            : "Analyze the selected image"
        }
      >
        <span>
          {" "}
          {/* Tooltip needs a DOM element wrapper when button is disabled */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            size="large"
            sx={{ mt: 2 }}
          >
            {isLoading ? "Processing..." : "Analyze Image"}
          </Button>
        </span>
      </Tooltip>

      <Typography variant="caption" sx={{ mt: 3, color: "text.secondary" }}>
        How to use: Click the upload area, select your fundus image file, and
        then click "Analyze Image". You will be redirected to the results page
        upon completion. Ensure the image is clear for best results.
      </Typography>
    </Paper>
  );
};

export default HomePage;
