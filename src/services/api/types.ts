// src/services/api/types.ts

// Base interface for analysis results
export interface AnalysisResultBase {
  prediction: "Normal" | "Mild" | "Moderate" | "Severe" | "PDR";
  confidence: number;
  explanation: string;
}

// Interface for the result coming from a new analysis (includes blob URL)
export interface NewAnalysisResult extends AnalysisResultBase {
  originalImageUrl: string; // Could be blob URL or backend URL
  gradCamImageUrl: string; // Backend URL or placeholder
}

// Interface for history list items (summary)
export interface HistoryEntry {
  id: string;
  date: string; // ISO string format
  imageName: string;
  prediction: AnalysisResultBase["prediction"];
  confidence: number;
}

// Interface for detailed history view (includes necessary details)
export interface HistoryDetail extends AnalysisResultBase {
  id: string;
  date: string; // ISO string format
  imageName: string;
  // Assume backend provides direct URLs for stored history images
  originalImageUrl: string;
  gradCamImageUrl: string;
}

// Utility type guard to check if an object is a NewAnalysisResult
export function isNewAnalysisResult(result: any): result is NewAnalysisResult {
  // Add checks based on properties unique to NewAnalysisResult if necessary,
  // otherwise, rely on context (where it came from)
  return (
    result &&
    typeof result.originalImageUrl === "string" &&
    typeof result.gradCamImageUrl === "string"
  );
}

// Utility type guard to check if an object is a HistoryDetail
export function isHistoryDetail(result: any): result is HistoryDetail {
  return (
    result &&
    typeof result.id === "string" &&
    typeof result.date === "string" &&
    typeof result.imageName === "string"
  );
}
