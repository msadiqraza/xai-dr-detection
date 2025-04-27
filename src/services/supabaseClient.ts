import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallback values for development
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'https://rptxvdnotxkhvnkztnqf.supabase.co';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdHh2ZG5vdHhraHZua3p0bnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Njg2NjIsImV4cCI6MjA2MTM0NDY2Mn0.z90MOJb1yBDS7RFVnaPhEd25Mmss-o1vcRU2XLNtj7g';

// Log for debugging
console.log('Environment mode:', import.meta.env.MODE);
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or anon key missing in environment variables');
}

// Create the Supabase client with options
let supabase: SupabaseClient;

try {
  console.log('Creating Supabase client...');
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  });
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  throw error;
}

export { supabase };
