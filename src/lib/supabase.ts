import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jbqqxhhcnlwijlztquro.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5tq5t_am5vck5XXMcEFAew_kaajxM-8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
