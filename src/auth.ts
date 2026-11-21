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
