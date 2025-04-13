
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gccirrkgvoppkwgkyqoz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjY2lycmtndm9wcGt3Z2t5cW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjE5MzgsImV4cCI6MjA2MDEzNzkzOH0._fynbfO3hhDYmnFaw1d8-f4hOLH-eeT0E5TVJvQJGVU";

// Configure Supabase client with auth options
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
