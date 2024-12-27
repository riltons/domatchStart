import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Tentando conectar ao Supabase com:', { supabaseUrl, supabaseAnonKey });

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
