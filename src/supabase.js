import { createClient } from '@supabase/supabase-js'

// REMPLACEZ par vos vraies valeurs
const supabaseUrl = 'https://rrmewqgykmebthmjuuul.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybWV3cWd5a21lYnRobWp1dXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTg4MDksImV4cCI6MjA3ODM3NDgwOX0.9AHiDs3rm2soY84zGT8p_7e0OB2q0k9RZSOlMJcr7hc'

console.log('Configuration Supabase:', { supabaseUrl, supabaseAnonKey });

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});