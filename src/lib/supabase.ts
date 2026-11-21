import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const configuredSupabaseUrl = "https://cobqmtujidfvjkyyowku.supabase.co";
const configuredSupabaseKey = "sb_publishable_yN4IUly8nnYecPNHsP7kJg_WXss91VU";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || configuredSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || configuredSupabaseKey;

export const isSupabaseConfigured =
    Boolean(supabaseUrl) &&
    !supabaseUrl?.includes("your-project") &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey?.includes("your-publishable");

export const supabase: SupabaseClient | null =
    isSupabaseConfigured && supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        })
        : null;
