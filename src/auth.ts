import { supabase } from "./lib/supabase";

export const AUTH_SESSION_KEY = "chifrica.session";
export const AUTH_USER_KEY = "chifrica.user";

export function isSignedIn() {
    return window.localStorage.getItem(AUTH_SESSION_KEY) !== null;
}

export function clearAuthSession() {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
}

export function setDemoAuthSession(userId = "admin") {
    window.localStorage.setItem(AUTH_SESSION_KEY, "demo");
    window.localStorage.setItem(AUTH_USER_KEY, userId);
}

export async function getCurrentUserId() {
    if (supabase) {
        const { data } = await supabase.auth.getSession();
        return data.session?.user.id ?? null;
    }
    return window.localStorage.getItem(AUTH_USER_KEY);
}

export async function getCurrentProfileName() {
    if (supabase) {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) {
            return "User";
        }

        const metadataName = user.user_metadata?.full_name?.trim();
        if (metadataName) {
            return metadataName;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();

        return profile?.full_name?.trim() || user.email?.split("@")[0] || "User";
    }

    return "Admin";
}
