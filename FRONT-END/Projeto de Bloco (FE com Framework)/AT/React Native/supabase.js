import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://ypqinedsahltuzurrfhq.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwcWluZWRzYWhsdHV6dXJyZmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDAzNzIsImV4cCI6MjA3Mzc3NjM3Mn0.mzXh8RMv8Luj6aPmEoNCC4hp3up3meC1iCcPIu65SXY";


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
});
