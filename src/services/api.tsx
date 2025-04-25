// src/services/api.ts

export interface AnalysisResult {
  prediction: "Normal" | "Mild" | "Moderate" | "Severe" | "PDR";
  confidence: number;
  originalImageUrl: string;
  gradCamImageUrl: string;
  explanation: string;
}

// --- Interface for History ---
export interface HistoryEntry {
  id: string;
  date: string; // ISO string format is good for consistency
  imageName: string;
  prediction: AnalysisResult["prediction"];
  confidence: number;
  // Add optional originalImageUrl or gradCamImageUrl if needed for history view later
}

// --- Mock Analysis API ---
export const analyzeImage = async (
  imageFile: File
): Promise<AnalysisResult> => {
  // ... (keep existing analyzeImage implementation)
  console.log("Simulating API call for image:", imageFile.name);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const originalImageUrl = URL.createObjectURL(imageFile);

  const mockResponses: AnalysisResult[] = [
    {
      prediction: "Moderate",
      confidence: 0.88,
      originalImageUrl: originalImageUrl,
      gradCamImageUrl: "/placeholder-gradcam.jpg",
      explanation:
        "The Grad-CAM highlights indicate significant microaneurysms...",
    },
    {
      prediction: "Normal",
      confidence: 0.97,
      originalImageUrl: originalImageUrl,
      gradCamImageUrl: "/placeholder-gradcam.jpg",
      explanation: "The fundus appears within normal limits...",
    },
    {
      prediction: "PDR",
      confidence: 0.92,
      originalImageUrl: originalImageUrl,
      gradCamImageUrl: "/placeholder-gradcam.jpg",
      explanation: "Extensive neovascularization is highlighted...",
    },
  ];
  const randomResponse =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];
  console.log("Simulated API response:", randomResponse);
  return randomResponse;
};

// --- Mock History API ---
export const fetchHistory = async (): Promise<HistoryEntry[]> => {
  console.log("Simulating API call for history");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // --- Hardcoded Mock History ---
  const mockHistoryData: HistoryEntry[] = [
    {
      id: "hist_001",
      date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      imageName: "patient_a_left_eye.jpg",
      prediction: "Mild",
      confidence: 0.91,
    },
    {
      id: "hist_002",
      date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      imageName: "scan_ref_123.png",
      prediction: "Normal",
      confidence: 0.98,
    },
    {
      id: "hist_003",
      date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      imageName: "fundus_img_45.jpeg",
      prediction: "Moderate",
      confidence: 0.85,
    },
    {
      id: "hist_004",
      date: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
      imageName: "eye_checkup_patient_b.tif",
      prediction: "Severe",
      confidence: 0.93,
    },
  ];

  console.log("Simulated history response:", mockHistoryData);
  return Promise.resolve(mockHistoryData);

  // --- Error Simulation (Optional) ---
  // if (Math.random() < 0.1) { // Simulate a 10% chance of error
  //   console.error("Simulated History API Error");
  //   throw new Error("Failed to fetch history (Simulated Error)");
  // }
};

// --- Utility to get Chip color (can be reused) ---
export const getChipColor = (
  prediction: AnalysisResult["prediction"]
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
