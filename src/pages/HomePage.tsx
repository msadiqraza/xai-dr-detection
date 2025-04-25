// src/pages/HomePage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Correct the import here: use NewAnalysisResult
import { analyzeImage, NewAnalysisResult } from "../services/api"; // Path updated
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        console.log("Revoked preview Blob URL:", previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... (keep existing file change logic)
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(
          "Invalid file type. Please upload an image (JPEG, PNG, etc.)."
        );
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
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
      // The result here is of type NewAnalysisResult
      const result: NewAnalysisResult = await analyzeImage(selectedFile);

      // Pass the result (which is NewAnalysisResult) via state
      navigate("/results", { state: { analysisResult: result } });
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      setError(err.message || "An error occurred during analysis.");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        {" "}
        Analyze Fundus Image for Diabetic Retinopathy{" "}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        {" "}
        Upload a fundus image (e.g., JPEG, PNG)...{" "}
      </Typography>

      {/* ... rest of the component (Input, Upload Area, Preview, Button, etc.) ... */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        disabled={isLoading}
      />
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
            "&:hover": { backgroundColor: "#eeeeee" },
          }}
          onClick={handleUploadClick}
        >
          <CloudUploadIcon
            sx={{ fontSize: 60, color: "primary.main", mb: 1 }}
          />
          <Typography>
            {" "}
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : "Click or Drag & Drop Image Here"}{" "}
          </Typography>
        </Box>
      </Tooltip>
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
          {" "}
          <Typography variant="caption" display="block" gutterBottom>
            Preview:
          </Typography>{" "}
          <img
            src={previewUrl}
            alt="Selected Fundus Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
          />{" "}
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
      {isLoading && <LoadingSpinner message="Analyzing image..." />}
      <Tooltip
        title={
          !selectedFile
            ? "Please select an image first"
            : "Analyze the selected image"
        }
      >
        <span>
          {" "}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            size="large"
            sx={{ mt: 2 }}
          >
            {" "}
            {isLoading ? "Processing..." : "Analyze Image"}{" "}
          </Button>{" "}
        </span>
      </Tooltip>
      <Typography variant="caption" sx={{ mt: 3, color: "text.secondary" }}>
        {" "}
        How to use: Click the upload area...{" "}
      </Typography>
    </Paper>
  );
};

export default HomePage;
