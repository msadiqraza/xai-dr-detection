// src/services/api/history.ts
import { HistoryEntry, HistoryDetail } from "./types";

// --- Mock Database (Simulates stored historical data) ---
// In a real app, the backend database would hold this.
const mockHistoryDatabase: HistoryDetail[] = [
  {
    id: "hist_001",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    imageName: "patient_a_left_eye.jpg",
    prediction: "Mild",
    confidence: 0.91,
    originalImageUrl: "/placeholder-fundus.jpg", // Using placeholders for history detail view
    gradCamImageUrl: "/placeholder-gradcam.jpg",
    explanation:
      "Historical analysis indicated mild non-proliferative changes with few microaneurysms, consistent with initial stages.",
  },
  {
    id: "hist_002",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    imageName: "scan_ref_123.png",
    prediction: "Normal",
    confidence: 0.98,
    originalImageUrl: "/placeholder-fundus.jpg",
    gradCamImageUrl: "/placeholder-gradcam.jpg", // Can use different placeholders if available
    explanation:
      "Previous scan showed no significant signs of diabetic retinopathy. Vascular structure and optic disc appeared healthy.",
  },
  {
    id: "hist_003",
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    imageName: "fundus_img_45.jpeg",
    prediction: "Moderate",
    confidence: 0.85,
    originalImageUrl: "/placeholder-fundus.jpg",
    gradCamImageUrl: "/placeholder-gradcam.jpg",
    explanation:
      "Analysis from 10 days ago revealed moderate NPDR features including notable hemorrhages and exudates in the superior temporal quadrant.",
  },
  {
    id: "hist_004",
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    imageName: "eye_checkup_patient_b.tif",
    prediction: "Severe",
    confidence: 0.93,
    originalImageUrl: "/placeholder-fundus.jpg",
    gradCamImageUrl: "/placeholder-gradcam.jpg",
    explanation:
      "Severe non-proliferative diabetic retinopathy detected 15 days prior, characterized by significant vascular abnormalities and macular edema suggested by Grad-CAM focus.",
  },
];
// --- End Mock Database ---

// --- Mock History List API ---
// Fetches summary data for the history page.
export const fetchHistory = async (): Promise<HistoryEntry[]> => {
  console.log("Simulating API call for history list");
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Extract summary data from the mock database
  const historySummary = mockHistoryDatabase.map((detail) => ({
    id: detail.id,
    date: detail.date,
    imageName: detail.imageName,
    prediction: detail.prediction,
    confidence: detail.confidence,
  }));

  console.log("Simulated history list response:", historySummary);
  return Promise.resolve(historySummary);
};

// --- Mock History Detail API ---
// Fetches the full details for a specific history entry.
export const fetchHistoryDetails = async (
  id: string
): Promise<HistoryDetail | null> => {
  console.log(`Simulating API call for history detail: ${id}`);
  await new Promise((resolve) => setTimeout(resolve, 600)); // Shorter delay for detail

  // Find the entry in our mock database
  const detail = mockHistoryDatabase.find((entry) => entry.id === id);

  if (detail) {
    console.log("Simulated history detail response:", detail);
    return Promise.resolve(detail);
  } else {
    console.error(`History entry with id ${id} not found.`);
    return Promise.reject(new Error(`History entry with id ${id} not found.`)); // Simulate API error
    // return Promise.resolve(null); // Or return null if preferred
  }
};
