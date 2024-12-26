import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Substitua pela URL do seu projeto Supabase
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Substitua pela chave anônima do seu projeto Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
