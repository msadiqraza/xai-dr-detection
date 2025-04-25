// src/services/api/index.ts

// Export types
export * from "./types";

// Export functions
export { analyzeImage, getChipColor } from "./analysis";
export { fetchHistory, fetchHistoryDetails } from "./history";

// Export specific interfaces if needed directly (though often importing from types is cleaner)
// export type { NewAnalysisResult, HistoryEntry, HistoryDetail } from './types';
