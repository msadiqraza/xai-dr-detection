export interface AnalysisResult {
  prediction: "Normal" | "Mild" | "Moderate" | "Severe" | "PDR";
  confidence: number; // e.g., 0.95 for 95%
  originalImageUrl: string; // URL to the original image (could be blob URL initially)
  gradCamImageUrl: string; // URL to the Grad-CAM image
  explanation: string; // NLP explanation
}

// --- MOCK IMPLEMENTATION ---
// This function simulates calling the backend API.
// Replace this with actual fetch/axios call later.
export const analyzeImage = async (
  imageFile: File
): Promise<AnalysisResult> => {
  console.log("Simulating API call for image:", imageFile.name);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate processing and getting results
  // In a real scenario, the backend would return URLs to the processed images stored somewhere.
  // For the mock, we'll use placeholder public URLs and generate a blob URL for the original.
  const originalImageUrl = URL.createObjectURL(imageFile); // Create temporary URL for uploaded file

  // --- Hardcoded Mock Response ---
  const mockResponses: AnalysisResult[] = [
    {
      prediction: "Moderate",
      confidence: 0.88,
      originalImageUrl: originalImageUrl, // Use the generated blob URL
      gradCamImageUrl: "/placeholder-gradcam.jpg", // Use the placeholder from public folder
      explanation:
        "The Grad-CAM highlights indicate significant microaneurysms and small hemorrhages concentrated in the macular region, consistent with moderate non-proliferative diabetic retinopathy. Vascular tortuosity is also noted peripherally.",
    },
    {
      prediction: "Normal",
      confidence: 0.97,
      originalImageUrl: originalImageUrl,
      gradCamImageUrl: "/placeholder-gradcam.jpg", // Use a different or same placeholder
      explanation:
        "The fundus appears within normal limits. The Grad-CAM overlay shows minimal activation, primarily focused on the optic disc and major vessels, which is expected. No significant pathological features suggestive of diabetic retinopathy were detected.",
    },
    {
      prediction: "PDR",
      confidence: 0.92,
      originalImageUrl: originalImageUrl,
      gradCamImageUrl: "/placeholder-gradcam.jpg", // Use a different or same placeholder
      explanation:
        "Extensive neovascularization is highlighted by Grad-CAM, particularly near the optic disc (NVD) and extending into the vitreous. Significant hemorrhages and exudates are also present. These features strongly indicate proliferative diabetic retinopathy (PDR).",
    },
  ];

  // Return a random response for variety
  const randomResponse =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];

  console.log("Simulated API response:", randomResponse);
  return randomResponse;

  // --- Error Simulation (Optional) ---
  // if (Math.random() < 0.1) { // Simulate a 10% chance of error
  //   console.error("Simulated API Error");
  //   throw new Error("Failed to process image (Simulated Error)");
  // }
};

// --- IMPORTANT ---
// Remember to revoke the Blob URL when the component unmounts or the URL is no longer needed
// to prevent memory leaks. This is often done in a useEffect cleanup function in the component
// that calls `analyzeImage`.
// Example:
// useEffect(() => {
//   let objectUrl: string | null = null;
//   // ... logic to get result ...
//   if (result) objectUrl = result.originalImageUrl;
//
//   return () => {
//     if (objectUrl) {
//       URL.revokeObjectURL(objectUrl);
//       console.log('Revoked Blob URL:', objectUrl)
//     }
//   };
// }, [result]); // Adjust dependency array as needed
