import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallback values for development
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
