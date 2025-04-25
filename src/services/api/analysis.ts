// src/services/api/analysis.ts
import { NewAnalysisResult, AnalysisResultBase } from "./types";

// --- Mock Analysis API ---
// Simulates calling the backend API for a new image.
export const analyzeImage = async (
  imageFile: File
): Promise<NewAnalysisResult> => {
  console.log("Simulating API call for image:", imageFile.name);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Create temporary URL for the uploaded file for immediate display
  const originalImageUrlBlob = URL.createObjectURL(imageFile);

  // --- Hardcoded Mock Response (Structure matches NewAnalysisResult) ---
  const mockResponsesData: Omit<NewAnalysisResult, "originalImageUrl">[] = [
    {
      prediction: "Moderate",
      confidence: 0.88,
      gradCamImageUrl: "/placeholder-gradcam.jpg",
      explanation:
        "The Grad-CAM highlights indicate significant microaneurysms and small hemorrhages concentrated in the macular region, consistent with moderate non-proliferative diabetic retinopathy. Vascular tortuosity is also noted peripherally.",
    },
    {
      prediction: "Normal",
      confidence: 0.97,
      gradCamImageUrl: "/placeholder-gradcam.jpg",
      explanation:
        "The fundus appears within normal limits. The Grad-CAM overlay shows minimal activation, primarily focused on the optic disc and major vessels, which is expected. No significant pathological features suggestive of diabetic retinopathy were detected.",
    },
    {
      prediction: "PDR",
      confidence: 0.92,
      gradCamImageUrl: "/placeholder-gradcam.jpg",
      explanation:
        "Extensive neovascularization is highlighted by Grad-CAM, particularly near the optic disc (NVD) and extending into the vitreous. Significant hemorrhages and exudates are also present. These features strongly indicate proliferative diabetic retinopathy (PDR).",
    },
  ];

  // Select a random base response
  const randomBaseResponse =
    mockResponsesData[Math.floor(Math.random() * mockResponsesData.length)];

  // Construct the full response including the blob URL
  const finalResponse: NewAnalysisResult = {
    ...randomBaseResponse,
    originalImageUrl: originalImageUrlBlob, // Use the blob URL
  };

  console.log("Simulated API response:", finalResponse);
  return finalResponse;
};

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
