import { useEffect, useState, type FormEvent } from "react";
import { FiCamera, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { getCurrentUserId } from "../../auth";
import { supabase } from "../../lib/supabase";
import "./style.css";

type ProfileForm = {
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string;
};

const emptyProfile: ProfileForm = { fullName: "", email: "", phone: "", avatarUrl: "" };

const Profile = () => {
    const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
    const [savedProfile, setSavedProfile] = useState<ProfileForm>(emptyProfile);
    const [createdAt, setCreatedAt] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        let cancelled = false;
        const loadProfile = async () => {
            try {
                if (!supabase) {
                    throw new Error("Supabase is not configured. Profile information cannot be loaded.");
                }
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    throw userError;
                }
                if (!user) {
                    throw new Error("Your session has expired. Please sign in again.");
                }
                const { data, error: profileError } = await supabase
                    .from("profiles")
                    .select("full_name,phone,avatar_url,created_at")
                    .eq("id", user.id)
                    .maybeSingle();
                if (profileError) {
                    throw profileError;
                }
                if (!cancelled) {
                    const loadedProfile = {
                        fullName: data?.full_name ?? user.user_metadata?.full_name ?? "",
                        email: user.email ?? "",
                        phone: data?.phone ?? user.user_metadata?.phone ?? "",
                        avatarUrl: data?.avatar_url ?? "",
                    };
                    setProfile(loadedProfile);
                    setSavedProfile(loadedProfile);
                    setCreatedAt(data?.created_at ?? user.created_at);
                }
            } catch (loadError) {
                console.error("Unable to load user profile.", loadError);
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Profile information could not be loaded.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadProfile();
        return () => {
            cancelled = true;
        };
    }, []);

    const updateField = (field: keyof ProfileForm, value: string) => {
        setProfile((current) => ({ ...current, [field]: value }));
    };

    const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setNotice("");
        if (!supabase) {
            setError("Supabase is not configured. Profile changes cannot be saved.");
            return;
        }
        setSaving(true);
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error("Your session has expired. Please sign in again.");
            }
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert({
                    id: userId,
                    full_name: profile.fullName.trim(),
                    phone: profile.phone.trim() || null,
                    avatar_url: profile.avatarUrl.trim() || null,
                    updated_at: new Date().toISOString(),
                });
            if (profileError) {
                throw profileError;
            }

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                throw userError;
            }
            const { error: accountError } = await supabase.auth.updateUser({
                ...(profile.email.trim() !== user?.email ? { email: profile.email.trim() } : {}),
                data: {
                    full_name: profile.fullName.trim(),
                    phone: profile.phone.trim(),
                },
            });
            if (accountError) {
                throw new Error(`Your profile was saved, but account details could not be synchronized: ${accountError.message}`);
            }
            if (profile.email.trim() !== user?.email) {
                setNotice("Profile saved. Check your new email inbox to confirm the address change.");
            } else {
                setNotice("Your profile has been updated.");
            }
            setSavedProfile(profile);
            setEditing(false);
        } catch (saveError) {
            console.error("Unable to save user profile.", saveError);
            setError(saveError instanceof Error ? saveError.message : "Profile changes could not be saved.");
        } finally {
            setSaving(false);
        }
    };

    const initials = profile.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

    return (
        <main className="profile-page">
            <div className="profile-page-inner">
                <header className="profile-page-heading">
                    <div>
                        <p className="profile-eyebrow">YOUR ACCOUNT</p>
                        <h1>My profile</h1>
                        <p>Manage your personal information and how we can reach you.</p>
                    </div>
                    {!loading && !editing && (
                        <button className="profile-edit-button" type="button" onClick={() => { setProfile(savedProfile); setError(""); setNotice(""); setEditing(true); }}>
                            Edit profile
                        </button>
                    )}
                </header>

                {error && <p className="profile-message profile-message--error" role="alert">{error}</p>}
                {notice && <p className="profile-message profile-message--success" role="status">{notice}</p>}

                {loading ? (
                    <p className="profile-loading" role="status">Loading your profile...</p>
                ) : (
                    <form className="profile-card" onSubmit={(event) => void saveProfile(event)}>
                        <section className="profile-summary" aria-label="Profile picture">
                            <div className="profile-avatar">
                                {profile.avatarUrl
                                    ? <img src={profile.avatarUrl} alt={`${profile.fullName || "Your"} profile`} />
                                    : initials || <FiUser aria-hidden="true" />}
                            </div>
                            <div>
                                <h2>{profile.fullName || "Your profile"}</h2>
                                <p>{profile.email || "Add an email address"}</p>
                                {createdAt && <span>Member since {new Date(createdAt).toLocaleDateString()}</span>}
                            </div>
                        </section>

                        <div className="profile-fields">
                            <label>
                                <span>Full name</span>
                                <span className="profile-input-wrap"><FiUser aria-hidden="true" />
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(event) => updateField("fullName", event.target.value)}
                                        required
                                        readOnly={!editing}
                                    />
                                </span>
                            </label>
                            <label>
                                <span>Email address</span>
                                <span className="profile-input-wrap"><FiMail aria-hidden="true" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(event) => updateField("email", event.target.value)}
                                        required
                                        readOnly={!editing}
                                    />
                                </span>
                            </label>
                            <label>
                                <span>Phone number</span>
                                <span className="profile-input-wrap"><FiPhone aria-hidden="true" />
                                    <input
                                        type="tel"
                                        autoComplete="tel"
                                        value={profile.phone}
                                        onChange={(event) => updateField("phone", event.target.value)}
                                        readOnly={!editing}
                                        placeholder="Add a phone number"
                                    />
                                </span>
                            </label>
                            <label>
                                <span>Profile picture URL</span>
                                <span className="profile-input-wrap"><FiCamera aria-hidden="true" />
                                    <input
                                        type="url"
                                        value={profile.avatarUrl}
                                        onChange={(event) => updateField("avatarUrl", event.target.value)}
                                        readOnly={!editing}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </span>
                            </label>
                        </div>

                        {editing && (
                            <div className="profile-form-actions">
                                <button className="profile-cancel-button" type="button" disabled={saving} onClick={() => { setProfile(savedProfile); setEditing(false); setError(""); }}>
                                    Cancel
                                </button>
                                <button className="profile-edit-button" type="submit" disabled={saving}>
                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </main>
    );
};

export default Profile;
