import { createClient } from '@supabase/supabase-js'

// Assurez-vous que ces valeurs sont CORRECTES
const supabaseUrl = 'https://zidhelrixuaiitglvzru.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZGhlbHJpeHVhaWl0Z2x2enJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODE0NDUsImV4cCI6MjA5Njc1NzQ0NX0.oA0j252xNOng8if7bg6whd4ryxXHELhRSMZrcmrdtxM'

console.log('🔍 Initialisation Supabase...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// Test de connexion (optionnel mais utile)
supabase.from('persons').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) console.error('❌ Supabase erreur:', error.message)
    else console.log('✅ Supabase connecté')
  })