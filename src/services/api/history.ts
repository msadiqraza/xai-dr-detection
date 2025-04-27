// src/services/api/history.ts
import { HistoryEntry, HistoryDetail, AnalysisResultBase } from "./types";
import { supabase } from "../../services/supabaseClient";
// We don't need this import as we're not using date formatting here

// Fetches summary data for the history page using Supabase
export const fetchHistory = async (): Promise<HistoryEntry[]> => {
  console.log("Fetching history from Supabase");
  
  try {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session, user must be logged in to view history");
      return [];
    }
    
    // Query the database for this user's history, ordered by most recent first
    const { data, error } = await supabase
      .from('analysis_history')
      .select('id, created_at, image_name, prediction, confidence')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching history:", error.message);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No history records found");
      return [];
    }
    
    // Map the database response to our HistoryEntry interface
    const historyEntries: HistoryEntry[] = data.map(record => ({
      id: record.id,
      date: record.created_at,
      imageName: record.image_name,
      prediction: record.prediction as AnalysisResultBase["prediction"],
      confidence: record.confidence,
    }));
    
    console.log(`Retrieved ${historyEntries.length} history records`);
    return historyEntries;
  } catch (error) {
    console.error("Unexpected error fetching history:", error);
    throw error;
  }
};

// Fetches the full details for a specific history entry
export const fetchHistoryDetails = async (
  id: string
): Promise<HistoryDetail | null> => {
  console.log(`Fetching history detail from Supabase: ${id}`);
  
  try {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session, user must be logged in to view history details");
      throw new Error("Authentication required");
    }
    
    // Query the specific record
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching history detail for ID ${id}:`, error.message);
      throw error;
    }
    
    if (!data) {
      console.error(`History entry with id ${id} not found`);
      return null;
    }
    
    // Map the database record to our HistoryDetail interface
    const historyDetail: HistoryDetail = {
      id: data.id,
      date: data.created_at,
      imageName: data.image_name,
      prediction: data.prediction as AnalysisResultBase["prediction"],
      confidence: data.confidence,
      explanation: data.explanation,
      originalImageUrl: data.original_image_url,
      gradCamImageUrl: data.gradcam_image_url,
    };
    
    console.log("Retrieved history detail:", historyDetail);
    return historyDetail;
  } catch (error) {
    console.error(`Unexpected error fetching history detail for ID ${id}:`, error);
    throw error;
  }
};

// Save a new analysis result to history
export const saveToHistory = async (analysisResult: AnalysisResultBase & { originalImageUrl: string, gradCamImageUrl: string, imageName: string }): Promise<string | null> => {
  console.log("Saving analysis result to history in Supabase");
  
  try {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No active session, user must be logged in to save history");
      throw new Error("Authentication required");
    }
    
    // Prepare the entry for saving
    const entry = {
      user_id: session.user.id,
      image_name: analysisResult.imageName,
      prediction: analysisResult.prediction,
      confidence: analysisResult.confidence,
      explanation: analysisResult.explanation,
      original_image_url: analysisResult.originalImageUrl,
      gradcam_image_url: analysisResult.gradCamImageUrl,
    };
    
    // Insert the record
    const { data, error } = await supabase
      .from('analysis_history')
      .insert(entry)
      .select('id')
      .single();
      
    if (error) {
      console.error("Error saving to history:", error.message);
      throw error;
    }
    
    if (!data) {
      console.error("Failed to retrieve ID for saved history entry");
      return null;
    }
    
    console.log(`Analysis result saved successfully with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error("Unexpected error saving to history:", error);
    throw error;
  }
};
