import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'VOTRE_URL_SUPABASE'
const supabaseAnonKey = 'VOTRE_CLE_ANON_PUBLIC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)