
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gccirrkgvoppkwgkyqoz.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjY2lycmtndm9wcGt3Z2t5cW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjE5MzgsImV4cCI6MjA2MDEzNzkzOH0._fynbfO3hhDYmnFaw1d8-f4hOLH-eeT0E5TVJvQJGVU";

// Configure Supabase client with auth options
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
