// src/services/api/analysis.ts
import { NewAnalysisResult, AnalysisResultBase } from "./types";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Real backend API implementation
export const analyzeImage = async (
  imageFile: File
): Promise<NewAnalysisResult> => {
  console.log("Sending image to backend API:", imageFile.name);

  // Create temporary URL for the original image (for immediate display)
  const originalImageUrlBlob = URL.createObjectURL(imageFile);

  // Create form data for the file upload
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    // Make the API request to the backend
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
      // No need to set Content-Type header with FormData, it sets it automatically
    });

    if (!response.ok) {
      // If the server response was not ok, parse the error message
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error occurred");
    }

    // Parse the successful response
    const data = await response.json();

    // Map the backend response to our frontend model
    // Backend provides: predicted_class, predicted_label, confidence, gradcam_image, explanation
    const predictionResult: NewAnalysisResult = {
      // Map predicted_label to our prediction enum
      prediction: mapBackendLabelToFrontend(data.predicted_label),
      confidence: data.confidence,
      explanation: data.explanation,
      // Convert base64 to data URL for the gradcam image
      gradCamImageUrl: `data:image/jpeg;base64,${data.gradcam_image}`,
      // Use blob URL for the original image
      originalImageUrl: originalImageUrlBlob,
    };

    console.log("Analysis complete:", predictionResult);
    return predictionResult;
  } catch (error) {
    console.error("Error during image analysis:", error);
    // Make sure to revoke the blob URL if there's an error
    URL.revokeObjectURL(originalImageUrlBlob);
    throw error;
  }
};

// Helper function to map backend labels to frontend prediction types
function mapBackendLabelToFrontend(backendLabel: string): AnalysisResultBase["prediction"] {
  // Normalize the backend label by converting to lowercase and handling variations
  const normalizedLabel = backendLabel.toLowerCase();
  
  if (normalizedLabel.includes("normal")) return "Normal";
  if (normalizedLabel.includes("mild")) return "Mild";
  if (normalizedLabel.includes("moderate")) return "Moderate";
  if (normalizedLabel.includes("severe")) return "Severe";
  if (normalizedLabel.includes("pdr") || normalizedLabel.includes("proliferative")) return "PDR";
  
  // Default case if no match is found
  console.warn(`Unknown backend label: ${backendLabel}, defaulting to 'Normal'`);
  return "Normal";
}

// --- Utility to get Chip color ---
export const getChipColor = (
  prediction: AnalysisResultBase["prediction"]
): "success" | "warning" | "error" | "info" | "default" => {
  switch (prediction) {
    case "Normal":
      return "success";
    case "Mild":
      return "info";
    case "Moderate":
      return "warning";
    case "Severe":
      return "error";
    case "PDR":
      return "error";
    default:
      return "default";
  }
};
