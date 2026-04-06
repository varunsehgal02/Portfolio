"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminLogin from "@/components/AdminLogin";
import NetworkBackground from "@/components/NetworkBackground";
import TargetCursor from "@/components/TargetCursor/TargetCursor";
import { isAuthenticated, logout } from "@/lib/auth";
import { saveData, getData, resetData, resetAllData } from "@/lib/editableData";
import {
    personalInfo as defaultPersonal,
    skills as defaultSkills,
    experience as defaultExperience,
    education as defaultEducation,
    certifications as defaultCerts,
} from "@/data/personal";
import { projects as defaultProjects, categories as defaultCategories } from "@/data/projects";
import {
    homePageContent as defaultHomeContent,
    aboutPageContent as defaultAboutContent,
    aboutBentoCards as defaultAboutBentoCards,
    projectsPageContent as defaultProjectsContent,
    contactPageContent as defaultContactContent,
    footerPageContent as defaultFooterContent,
} from "@/data/pageContent";

const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-light/80 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50";

const graphicProjectsTemplate = [
    {
        id: "graphic-mitansh-birthday",
        title: "Mitansh Birthday Poster",
        category: "graphic",
        description: "Birthday-themed gaming poster design for creator branding and engagement.",
        highlights: ["Poster Design", "Character Composition", "Brand Alignment", "Social-ready Format"],
        tools: ["Photoshop", "Illustrator", "Canva"],
        gradient: "from-purple-700 via-fuchsia-700 to-slate-800",
        icon: "🎂",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-mitansh-welcome",
        title: "Mitansh Welcome Poster",
        category: "graphic",
        description: "Welcome visual announcing creator onboarding with clean tournament-style typography.",
        highlights: ["Welcome Campaign", "Creator Onboarding", "Clean Layout", "Gaming Theme"],
        tools: ["Photoshop", "Canva"],
        gradient: "from-red-600 via-rose-500 to-zinc-700",
        icon: "🎮",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-boomboom-omchakra-set",
        title: "Creator Welcome Set (3 + 4)",
        category: "graphic",
        description: "Dual-poster creator welcome set. Keep image 3 and image 4 in this single project gallery.",
        highlights: ["2-image Project", "Character Art Poster", "Esports Branding", "Welcome Announcement"],
        tools: ["Photoshop", "Illustrator", "Canva"],
        gradient: "from-amber-600 via-red-700 to-zinc-900",
        icon: "🎨",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-fang-owner-manager",
        title: "FANG Owner & Manager Spotlight",
        category: "graphic",
        description: "Profile-style spotlight poster focused on leadership identity and team positioning.",
        highlights: ["Profile Poster", "Leadership Theme", "Brand Story Frame", "QR/CTA Placement"],
        tools: ["Photoshop", "Illustrator"],
        gradient: "from-cyan-700 via-slate-700 to-zinc-900",
        icon: "🛡️",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-xlnc-campaign-set",
        title: "Graphic Set (6 + 7 + 8 + 9)",
        category: "graphic",
        description: "Grouped multi-image project for images 6, 7, 8, and 9 as requested.",
        highlights: ["4-image Project", "Campaign Narrative", "Esports Visual Language", "Poster Series"],
        tools: ["Photoshop", "Illustrator", "Canva"],
        gradient: "from-slate-700 via-zinc-700 to-black",
        icon: "🧩",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-team-bhrama-core",
        title: "Team Bhrama Hero Poster",
        category: "graphic",
        description: "Team identity hero poster design with high-contrast red/black visual direction.",
        highlights: ["Team Branding", "Hero Composition", "Event-ready Creative", "Social Poster"],
        tools: ["Photoshop", "Canva"],
        gradient: "from-red-700 via-black to-zinc-900",
        icon: "🏆",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-team-bhrama-members",
        title: "Team Bhrama Member Intro",
        category: "graphic",
        description: "Member-introduction poster focused on roles and profile presentation.",
        highlights: ["Member Intro", "Role Highlight", "Clean Typography", "Event Branding"],
        tools: ["Photoshop", "Canva"],
        gradient: "from-red-700 via-zinc-900 to-black",
        icon: "👥",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
    {
        id: "graphic-team-bhrama-skills",
        title: "Team Bhrama Skills Spotlight",
        category: "graphic",
        description: "Skill-centric profile poster showcasing strengths and competencies.",
        highlights: ["Skill Matrix", "Profile Poster", "High Contrast", "Social-ready Format"],
        tools: ["Photoshop", "Canva"],
        gradient: "from-red-700 via-zinc-900 to-black",
        icon: "⚡",
        link: "",
        image: "",
        gallery: [],
        video: "",
    },
];

function normalizeProjectLink(raw) {
    const value = (raw || "").trim();
    if (!value) return "";
    if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) return value;
    return `https://${value}`;
}

function Field({ label, value, onChange, type = "text", rows = 0, placeholder = "" }) {
    return (
        <div>
            <label className="block text-text-muted text-xs mb-1.5 font-medium uppercase tracking-wider">{label}</label>
            {rows > 0 ? (
                <textarea
                    rows={rows}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClass}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-5 border border-primary/10">
            <div>
                <h2 className="font-display font-semibold text-xl text-text-primary">{title}</h2>
                {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export default function EditPage() {
    const [authed, setAuthed] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [savedMessage, setSavedMessage] = useState("");
    const [actionError, setActionError] = useState("");

    const [personal, setPersonal] = useState(defaultPersonal);
    const [skillsData, setSkillsData] = useState(defaultSkills);
    const [experienceData, setExperienceData] = useState(defaultExperience);
    const [education, setEducation] = useState(defaultEducation);
    const [certifications, setCertifications] = useState(defaultCerts);
    const [projectsData, setProjectsData] = useState(defaultProjects);
    const [projectCategories, setProjectCategories] = useState(defaultCategories);

    const [homeContent, setHomeContent] = useState(defaultHomeContent);
    const [aboutContent, setAboutContent] = useState(defaultAboutContent);
    const [aboutBentoCards, setAboutBentoCards] = useState(defaultAboutBentoCards);
    const [projectsContent, setProjectsContent] = useState(defaultProjectsContent);
    const [contactContent, setContactContent] = useState(defaultContactContent);
    const [footerContent, setFooterContent] = useState(defaultFooterContent);

    useEffect(() => {
        if (isAuthenticated()) {
            setAuthed(true);
            loadSavedData().catch(() => {});
        }
    }, []);

    const tabs = useMemo(
        () => [
            { id: "personal", label: "Personal", icon: "👤" },
            { id: "skills", label: "Skills", icon: "🛠️" },
            { id: "experience", label: "Experience", icon: "💼" },
            { id: "education", label: "Education", icon: "🎓" },
            { id: "certifications", label: "Certifications", icon: "🏅" },
            { id: "projects", label: "Projects", icon: "📁" },
            { id: "categories", label: "Project Categories", icon: "🏷️" },
            { id: "homeContent", label: "Home Page Text", icon: "🏠" },
            { id: "aboutContent", label: "About Page Text", icon: "✨" },
            { id: "projectsContent", label: "Projects Page Text", icon: "🚀" },
            { id: "contactContent", label: "Contact Page Text", icon: "✉️" },
            { id: "footerContent", label: "Footer", icon: "🧩" },
        ],
        []
    );

    const announceSaved = (msg) => {
        setSavedMessage(msg);
        setTimeout(() => setSavedMessage(""), 2200);
    };

    const getFriendlyActionError = (err, fallback) => {
        const message = err instanceof Error ? err.message : "";
        const normalized = message.toLowerCase();

        if (normalized.includes("failed to fetch") || normalized.includes("network")) {
            return "Unable to reach server. Please try again in a moment.";
        }

        if (normalized.includes("invalid") || normalized.includes("too many")) {
            return message;
        }

        return message || fallback;
    };

    const runEditorAction = async (action, successMessage, fallbackError) => {
        setActionError("");

        try {
            await action();
            announceSaved(successMessage);
        } catch (err) {
            setActionError(getFriendlyActionError(err, fallbackError));
        }
    };

    const loadSavedData = async () => {
        const [
            personalNext,
            skillsNext,
            experienceNext,
            educationNext,
            certsNext,
            projectsNext,
            categoriesNext,
            homeNext,
            aboutNext,
            aboutCardsNext,
            projectsContentNext,
            contactNext,
            footerNext,
        ] = await Promise.all([
            getData("personal", defaultPersonal),
            getData("skills", defaultSkills),
            getData("experience", defaultExperience),
            getData("education", defaultEducation),
            getData("certifications", defaultCerts),
            getData("projects", defaultProjects),
            getData("projectCategories", defaultCategories),
            getData("homeContent", defaultHomeContent),
            getData("aboutContent", defaultAboutContent),
            getData("aboutBentoCards", defaultAboutBentoCards),
            getData("projectsContent", defaultProjectsContent),
            getData("contactContent", defaultContactContent),
            getData("footerContent", defaultFooterContent),
        ]);

        setPersonal(personalNext);
        setSkillsData(skillsNext);
        setExperienceData(experienceNext);
        setEducation(educationNext);
        setCertifications(certsNext);
        setProjectsData(projectsNext);
        setProjectCategories(categoriesNext);
        setHomeContent(homeNext);
        setAboutContent(aboutNext);
        setAboutBentoCards(aboutCardsNext);
        setProjectsContent(projectsContentNext);
        setContactContent(contactNext);
        setFooterContent(footerNext);
    };

    const handleFileUpload = async (file, projectIndex, fieldName) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Upload failed");
            }

            if (data.url) {
                const updated = [...projectsData];
                updated[projectIndex] = { ...updated[projectIndex], [fieldName]: data.url };
                setProjectsData(updated);
                announceSaved("File uploaded");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Upload failed";
            setActionError(message);
        }
    };

    const handleGalleryUpload = async (file, projectIndex, galleryIndex) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Upload failed");
            }

            if (data.url) {
                const updated = [...projectsData];
                const gallery = Array.isArray(updated[projectIndex].gallery) ? [...updated[projectIndex].gallery] : [];
                gallery[galleryIndex] = data.url;
                updated[projectIndex] = { ...updated[projectIndex], gallery };
                setProjectsData(updated);
                announceSaved("Gallery image uploaded");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Upload failed";
            setActionError(message);
        }
    };

    if (!authed) {
        return (
            <AdminLogin
                title="Full Content Editor"
                onSuccess={() => {
                    setAuthed(true);
                    loadSavedData().catch(() => {});
                }}
            />
        );
    }

    return (
        <div className="relative min-h-screen pt-28 pb-20">
            <TargetCursor
                targetSelector="button, a, input, textarea, select, .cursor-target"
                spinDuration={2}
                hideDefaultCursor
                parallaxOn
                hoverDuration={0.2}
            />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <NetworkBackground className="opacity-90" />
            </div>

            <div className="relative z-[1] max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                    <div>
                        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
                            Full Site <span className="gradient-text">Editor</span>
                        </h1>
                        <p className="text-text-muted text-sm mt-1">Edit every section through form fields and save instantly.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {savedMessage && (
                            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-xs">
                                {savedMessage}
                            </div>
                        )}
                        {actionError && (
                            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 text-xs max-w-xs">
                                {actionError}
                            </div>
                        )}
                        <button
                            onClick={async () => {
                                await runEditorAction(
                                    async () => {
                                        await resetAllData();
                                        await loadSavedData();
                                    },
                                    "All edits reset",
                                    "Failed to reset all edits."
                                );
                            }}
                            className="px-4 py-2 rounded-xl glass text-text-secondary text-sm hover:text-amber-400"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                setAuthed(false);
                            }}
                            className="px-4 py-2 rounded-xl glass text-text-secondary text-sm hover:text-red-400"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    <aside className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-24">
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all ${
                                        activeTab === tab.id
                                            ? "bg-gradient-to-r from-primary to-secondary text-black"
                                            : "text-text-secondary hover:text-text-primary hover:bg-surface-light/60"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="space-y-6">
                        {activeTab === "personal" && (
                            <SectionCard title="Personal Profile" subtitle="All profile fields and stats cards">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field label="Name" value={personal.name} onChange={(v) => setPersonal({ ...personal, name: v })} />
                                    <Field label="Title" value={personal.title} onChange={(v) => setPersonal({ ...personal, title: v })} />
                                    <Field label="Tagline" value={personal.tagline} onChange={(v) => setPersonal({ ...personal, tagline: v })} />
                                    <Field label="Email" type="email" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} />
                                    <Field label="Phone" value={personal.phone} onChange={(v) => setPersonal({ ...personal, phone: v })} />
                                    <Field label="Location" value={personal.location} onChange={(v) => setPersonal({ ...personal, location: v })} />
                                    <Field
                                        label="Behance URL"
                                        value={personal.socials.behance}
                                        onChange={(v) => setPersonal({ ...personal, socials: { ...personal.socials, behance: v } })}
                                    />
                                    <Field
                                        label="LinkedIn URL"
                                        value={personal.socials.linkedin}
                                        onChange={(v) => setPersonal({ ...personal, socials: { ...personal.socials, linkedin: v } })}
                                    />
                                    <Field
                                        label="GitHub URL"
                                        value={personal.socials?.github ?? ""}
                                        onChange={(v) => setPersonal({ ...personal, socials: { ...personal.socials, github: v } })}
                                    />
                                    <Field
                                        label="Instagram URL"
                                        value={personal.socials?.instagram ?? ""}
                                        onChange={(v) => setPersonal({ ...personal, socials: { ...personal.socials, instagram: v } })}
                                    />
                                    <Field
                                        label="Resume PDF URL"
                                        value={personal.resumeUrl ?? "/resume/Varun_Sehgal.pdf"}
                                        onChange={(v) => setPersonal({ ...personal, resumeUrl: v })}
                                        placeholder="/resume/Your_Name.pdf"
                                    />
                                </div>

                                <Field label="Summary" rows={5} value={personal.summary} onChange={(v) => setPersonal({ ...personal, summary: v })} />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-text-primary font-semibold">Rotating Roles</h3>
                                        <button
                                            onClick={() =>
                                                setPersonal({
                                                    ...personal,
                                                    rotatingRoles: [...(personal.rotatingRoles || []), "New Role"],
                                                })
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                        >
                                            + Add Role
                                        </button>
                                    </div>
                                    <p className="text-text-muted text-xs">Shown in the rotating text on the About page ("I&apos;m a [role]").</p>
                                    {(personal.rotatingRoles || []).map((role, i) => (
                                        <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                                            <input
                                                value={role}
                                                onChange={(e) => {
                                                    const next = [...(personal.rotatingRoles || [])];
                                                    next[i] = e.target.value;
                                                    setPersonal({ ...personal, rotatingRoles: next });
                                                }}
                                                className={inputClass}
                                            />
                                            <button
                                                onClick={() => {
                                                    const next = (personal.rotatingRoles || []).filter((_, idx) => idx !== i);
                                                    setPersonal({ ...personal, rotatingRoles: next });
                                                }}
                                                className="px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-text-primary font-semibold">Stats Cards</h3>
                                        <button
                                            onClick={() =>
                                                setPersonal({
                                                    ...personal,
                                                    stats: [...personal.stats, { label: "New Stat", value: "0" }],
                                                })
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                        >
                                            + Add Stat
                                        </button>
                                    </div>

                                    {personal.stats.map((stat, i) => (
                                        <div key={`${stat.label}-${i}`} className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-end glass rounded-xl p-3">
                                            <Field
                                                label={`Stat ${i + 1} Label`}
                                                value={stat.label}
                                                onChange={(v) => {
                                                    const next = [...personal.stats];
                                                    next[i] = { ...next[i], label: v };
                                                    setPersonal({ ...personal, stats: next });
                                                }}
                                            />
                                            <Field
                                                label="Value"
                                                value={stat.value}
                                                onChange={(v) => {
                                                    const next = [...personal.stats];
                                                    next[i] = { ...next[i], value: v };
                                                    setPersonal({ ...personal, stats: next });
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const next = personal.stats.filter((_, idx) => idx !== i);
                                                    setPersonal({ ...personal, stats: next });
                                                }}
                                                className="h-11 px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => runEditorAction(
                                            async () => saveData("personal", personal),
                                            "Personal saved",
                                            "Failed to save personal profile."
                                        )}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold"
                                    >
                                        Save Personal
                                    </button>
                                    <button
                                        onClick={() => runEditorAction(
                                            async () => {
                                                await resetData("personal");
                                                setPersonal(defaultPersonal);
                                            },
                                            "Personal reset",
                                            "Failed to reset personal profile."
                                        )}
                                        className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "skills" && (
                            <SectionCard title="Skills" subtitle="Edit each skill category and each skill item">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-text-primary font-semibold">Skill Categories</h3>
                                    <button
                                        onClick={() => {
                                            const key = `New Category ${Object.keys(skillsData).length + 1}`;
                                            setSkillsData({ ...skillsData, [key]: ["New Skill"] });
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                    >
                                        + Add Category
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(skillsData).map(([category, items], catIdx) => (
                                        <div key={`${category}-${catIdx}`} className="glass rounded-xl p-4 space-y-3">
                                            <div className="flex gap-3 items-end">
                                                <div className="flex-1">
                                                    <Field
                                                        label="Category Name"
                                                        value={category}
                                                        onChange={(newName) => {
                                                            const entries = Object.entries(skillsData);
                                                            const renamed = entries.map(([k, v]) => (k === category ? [newName, v] : [k, v]));
                                                            setSkillsData(Object.fromEntries(renamed));
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const next = { ...skillsData };
                                                        delete next[category];
                                                        setSkillsData(next);
                                                    }}
                                                    className="h-11 px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {items.map((skill, i) => (
                                                    <div key={`${skill}-${i}`} className="grid grid-cols-[1fr_auto] gap-2">
                                                        <input
                                                            value={skill}
                                                            onChange={(e) => {
                                                                const next = { ...skillsData };
                                                                const updatedItems = [...next[category]];
                                                                updatedItems[i] = e.target.value;
                                                                next[category] = updatedItems;
                                                                setSkillsData(next);
                                                            }}
                                                            className={inputClass}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const next = { ...skillsData };
                                                                next[category] = next[category].filter((_, idx) => idx !== i);
                                                                setSkillsData(next);
                                                            }}
                                                            className="px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const next = { ...skillsData };
                                                    next[category] = [...next[category], "New Skill"];
                                                    setSkillsData(next);
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                            >
                                                + Add Skill
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => runEditorAction(
                                            async () => saveData("skills", skillsData),
                                            "Skills saved",
                                            "Failed to save skills."
                                        )}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold"
                                    >
                                        Save Skills
                                    </button>
                                    <button
                                        onClick={() => runEditorAction(
                                            async () => {
                                                await resetData("skills");
                                                setSkillsData(defaultSkills);
                                            },
                                            "Skills reset",
                                            "Failed to reset skills."
                                        )}
                                        className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "experience" && (
                            <SectionCard title="Experience" subtitle="Edit each experience card and all its highlight points">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-text-primary font-semibold">Experience Items</h3>
                                    <button
                                        onClick={() =>
                                            setExperienceData([
                                                ...experienceData,
                                                {
                                                    role: "New Role",
                                                    company: "Company",
                                                    location: "Location",
                                                    period: "Period",
                                                    highlights: ["New highlight"],
                                                },
                                            ])
                                        }
                                        className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                    >
                                        + Add Experience
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {experienceData.map((exp, index) => (
                                        <div key={index} className="glass rounded-xl p-4 space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <Field label="Role" value={exp.role} onChange={(v) => {
                                                    const next = [...experienceData];
                                                    next[index] = { ...next[index], role: v };
                                                    setExperienceData(next);
                                                }} />
                                                <Field label="Company" value={exp.company} onChange={(v) => {
                                                    const next = [...experienceData];
                                                    next[index] = { ...next[index], company: v };
                                                    setExperienceData(next);
                                                }} />
                                                <Field label="Location" value={exp.location} onChange={(v) => {
                                                    const next = [...experienceData];
                                                    next[index] = { ...next[index], location: v };
                                                    setExperienceData(next);
                                                }} />
                                                <Field label="Period" value={exp.period} onChange={(v) => {
                                                    const next = [...experienceData];
                                                    next[index] = { ...next[index], period: v };
                                                    setExperienceData(next);
                                                }} />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-text-secondary text-xs uppercase tracking-wider">Highlights</p>
                                                    <button
                                                        onClick={() => {
                                                            const next = [...experienceData];
                                                            next[index] = { ...next[index], highlights: [...next[index].highlights, "New highlight"] };
                                                            setExperienceData(next);
                                                        }}
                                                        className="px-2 py-1 rounded bg-primary/15 text-primary-light text-xs"
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                                {exp.highlights.map((h, hi) => (
                                                    <div key={hi} className="grid grid-cols-[1fr_auto] gap-2">
                                                        <input
                                                            value={h}
                                                            onChange={(e) => {
                                                                const next = [...experienceData];
                                                                const hs = [...next[index].highlights];
                                                                hs[hi] = e.target.value;
                                                                next[index] = { ...next[index], highlights: hs };
                                                                setExperienceData(next);
                                                            }}
                                                            className={inputClass}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const next = [...experienceData];
                                                                next[index] = {
                                                                    ...next[index],
                                                                    highlights: next[index].highlights.filter((_, idx) => idx !== hi),
                                                                };
                                                                setExperienceData(next);
                                                            }}
                                                            className="px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setExperienceData(experienceData.filter((_, i) => i !== index))}
                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove Experience Item
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("experience", experienceData), "Experience saved", "Failed to save experience.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Experience</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("experience"); setExperienceData(defaultExperience); }, "Experience reset", "Failed to reset experience.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "education" && (
                            <SectionCard title="Education" subtitle="Edit education fields displayed on site">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field label="Degree" value={education.degree} onChange={(v) => setEducation({ ...education, degree: v })} />
                                    <Field label="Institution" value={education.institution} onChange={(v) => setEducation({ ...education, institution: v })} />
                                    <Field label="Period" value={education.period} onChange={(v) => setEducation({ ...education, period: v })} />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("education", education), "Education saved", "Failed to save education.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Education</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("education"); setEducation(defaultEducation); }, "Education reset", "Failed to reset education.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "certifications" && (
                            <SectionCard title="Certifications" subtitle="Edit every certification line">
                                <div className="space-y-2">
                                    {certifications.map((cert, i) => (
                                        <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                                            <input
                                                value={cert}
                                                onChange={(e) => {
                                                    const next = [...certifications];
                                                    next[i] = e.target.value;
                                                    setCertifications(next);
                                                }}
                                                className={inputClass}
                                            />
                                            <button
                                                onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))}
                                                className="px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setCertifications([...certifications, "New certification"])} className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs">+ Add Certification</button>

                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("certifications", certifications), "Certifications saved", "Failed to save certifications.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Certifications</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("certifications"); setCertifications(defaultCerts); }, "Certifications reset", "Failed to reset certifications.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "projects" && (
                            <SectionCard title="Projects" subtitle="Edit each project card fields, tools, highlights, and media URLs/uploads">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-text-primary font-semibold">Project Items</h3>
                                    <div className="flex items-center gap-2 flex-wrap justify-end">
                                        <button
                                            onClick={() => setProjectsData(graphicProjectsTemplate)}
                                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 text-xs"
                                        >
                                            Replace with New Graphic Set
                                        </button>
                                        <button
                                            onClick={() =>
                                                setProjectsData([
                                                    ...projectsData,
                                                    {
                                                        id: `project-${Date.now()}`,
                                                        title: "New Project",
                                                        category: "graphic",
                                                        subCategory: "",
                                                        description: "Project description",
                                                        highlights: ["New highlight"],
                                                        tools: ["Photoshop"],
                                                        gradient: "from-indigo-500 via-purple-500 to-pink-500",
                                                        icon: "🆕",
                                                        link: "",
                                                        image: "",
                                                        gallery: [],
                                                        video: "",
                                                    },
                                                ])
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                        >
                                            + Add Project
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {projectsData.map((project, index) => (
                                        <div key={project.id || index} className="glass rounded-xl p-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <Field label="ID" value={project.id} onChange={(v) => {
                                                    const next = [...projectsData];
                                                    next[index] = { ...next[index], id: v };
                                                    setProjectsData(next);
                                                }} />
                                                <Field label="Title" value={project.title} onChange={(v) => {
                                                    const next = [...projectsData];
                                                    next[index] = { ...next[index], title: v };
                                                    setProjectsData(next);
                                                }} />
                                                <div>
                                                    <label className="block text-text-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Category</label>
                                                    <select
                                                        value={project.category}
                                                        onChange={(e) => {
                                                            const next = [...projectsData];
                                                            next[index] = { ...next[index], category: e.target.value };
                                                            setProjectsData(next);
                                                        }}
                                                        className={inputClass}
                                                    >
                                                        <option value="uiux">UI/UX</option>
                                                        <option value="graphic">Graphic</option>
                                                        <option value="motion">Motion</option>
                                                    </select>
                                                </div>
                                                <Field label="Sub Category" value={project.subCategory || ""} onChange={(v) => {
                                                    const next = [...projectsData];
                                                    next[index] = { ...next[index], subCategory: v };
                                                    setProjectsData(next);
                                                }} />
                                                <Field label="Icon" value={project.icon} onChange={(v) => {
                                                    const next = [...projectsData];
                                                    next[index] = { ...next[index], icon: v };
                                                    setProjectsData(next);
                                                }} />
                                                <Field label="Gradient Classes" value={project.gradient} onChange={(v) => {
                                                    const next = [...projectsData];
                                                    next[index] = { ...next[index], gradient: v };
                                                    setProjectsData(next);
                                                }} />
                                                <Field label="Project Link" value={project.link || ""} onChange={(v) => {
                                                    const next = [...projectsData];
                                                    next[index] = { ...next[index], link: normalizeProjectLink(v) };
                                                    setProjectsData(next);
                                                }} />
                                            </div>

                                            <Field label="Description" rows={3} value={project.description} onChange={(v) => {
                                                const next = [...projectsData];
                                                next[index] = { ...next[index], description: v };
                                                setProjectsData(next);
                                            }} />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-text-secondary text-xs uppercase tracking-wider">Highlights</p>
                                                        <button
                                                            onClick={() => {
                                                                const next = [...projectsData];
                                                                next[index] = { ...next[index], highlights: [...next[index].highlights, "New highlight"] };
                                                                setProjectsData(next);
                                                            }}
                                                            className="px-2 py-1 rounded bg-primary/15 text-primary-light text-xs"
                                                        >
                                                            + Add
                                                        </button>
                                                    </div>
                                                    {project.highlights.map((h, hi) => (
                                                        <div key={hi} className="grid grid-cols-[1fr_auto] gap-2">
                                                            <input
                                                                value={h}
                                                                onChange={(e) => {
                                                                    const next = [...projectsData];
                                                                    const arr = [...next[index].highlights];
                                                                    arr[hi] = e.target.value;
                                                                    next[index] = { ...next[index], highlights: arr };
                                                                    setProjectsData(next);
                                                                }}
                                                                className={inputClass}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const next = [...projectsData];
                                                                    next[index] = {
                                                                        ...next[index],
                                                                        highlights: next[index].highlights.filter((_, idx) => idx !== hi),
                                                                    };
                                                                    setProjectsData(next);
                                                                }}
                                                                className="px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-text-secondary text-xs uppercase tracking-wider">Tools</p>
                                                        <button
                                                            onClick={() => {
                                                                const next = [...projectsData];
                                                                next[index] = { ...next[index], tools: [...next[index].tools, "New tool"] };
                                                                setProjectsData(next);
                                                            }}
                                                            className="px-2 py-1 rounded bg-primary/15 text-primary-light text-xs"
                                                        >
                                                            + Add
                                                        </button>
                                                    </div>
                                                    {project.tools.map((tool, ti) => (
                                                        <div key={ti} className="grid grid-cols-[1fr_auto] gap-2">
                                                            <input
                                                                value={tool}
                                                                onChange={(e) => {
                                                                    const next = [...projectsData];
                                                                    const arr = [...next[index].tools];
                                                                    arr[ti] = e.target.value;
                                                                    next[index] = { ...next[index], tools: arr };
                                                                    setProjectsData(next);
                                                                }}
                                                                className={inputClass}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const next = [...projectsData];
                                                                    next[index] = {
                                                                        ...next[index],
                                                                        tools: next[index].tools.filter((_, idx) => idx !== ti),
                                                                    };
                                                                    setProjectsData(next);
                                                                }}
                                                                className="px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Field
                                                        label="Image URL"
                                                        value={project.image || ""}
                                                        onChange={(v) => {
                                                            const next = [...projectsData];
                                                            next[index] = { ...next[index], image: v };
                                                            setProjectsData(next);
                                                        }}
                                                    />
                                                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 text-primary-light text-xs cursor-pointer">
                                                        Upload Image
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    handleFileUpload(e.target.files[0], index, "image");
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>

                                                <div className="space-y-2">
                                                    <Field
                                                        label="Video URL"
                                                        value={project.video || ""}
                                                        onChange={(v) => {
                                                            const next = [...projectsData];
                                                            next[index] = { ...next[index], video: v };
                                                            setProjectsData(next);
                                                        }}
                                                    />
                                                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 text-primary-light text-xs cursor-pointer">
                                                        Upload Video
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    handleFileUpload(e.target.files[0], index, "video");
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2 border-t border-primary/10">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-text-secondary text-xs uppercase tracking-wider">Gallery Images (for grouped projects)</p>
                                                    <button
                                                        onClick={() => {
                                                            const next = [...projectsData];
                                                            const gallery = Array.isArray(next[index].gallery) ? [...next[index].gallery] : [];
                                                            gallery.push("");
                                                            next[index] = { ...next[index], gallery };
                                                            setProjectsData(next);
                                                        }}
                                                        className="px-2 py-1 rounded bg-primary/15 text-primary-light text-xs"
                                                    >
                                                        + Add Gallery Image
                                                    </button>
                                                </div>

                                                {(Array.isArray(project.gallery) ? project.gallery : []).map((img, gi) => (
                                                    <div key={`${project.id || index}-gallery-${gi}`} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                                                        <Field
                                                            label={`Gallery ${gi + 1} URL`}
                                                            value={img || ""}
                                                            onChange={(v) => {
                                                                const next = [...projectsData];
                                                                const gallery = Array.isArray(next[index].gallery) ? [...next[index].gallery] : [];
                                                                gallery[gi] = v;
                                                                next[index] = { ...next[index], gallery };
                                                                setProjectsData(next);
                                                            }}
                                                        />
                                                        <label className="h-11 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 text-primary-light text-xs cursor-pointer">
                                                            Upload
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files?.[0]) {
                                                                        handleGalleryUpload(e.target.files[0], index, gi);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                        <button
                                                            onClick={() => {
                                                                const next = [...projectsData];
                                                                const gallery = (Array.isArray(next[index].gallery) ? next[index].gallery : []).filter((_, idx) => idx !== gi);
                                                                next[index] = { ...next[index], gallery };
                                                                setProjectsData(next);
                                                            }}
                                                            className="h-11 px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setProjectsData(projectsData.filter((_, i) => i !== index))}
                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove Project
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("projects", projectsData), "Projects saved", "Failed to save projects.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Projects</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("projects"); setProjectsData(defaultProjects); }, "Projects reset", "Failed to reset projects.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "categories" && (
                            <SectionCard title="Project Categories" subtitle="Edit category ids and labels used in projects filter">
                                <div className="space-y-2">
                                    {projectCategories.map((cat, i) => (
                                        <div key={`${cat.id}-${i}`} className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-2 items-end">
                                            <Field
                                                label="ID"
                                                value={cat.id}
                                                onChange={(v) => {
                                                    const next = [...projectCategories];
                                                    next[i] = { ...next[i], id: v };
                                                    setProjectCategories(next);
                                                }}
                                            />
                                            <Field
                                                label="Label"
                                                value={cat.label}
                                                onChange={(v) => {
                                                    const next = [...projectCategories];
                                                    next[i] = { ...next[i], label: v };
                                                    setProjectCategories(next);
                                                }}
                                            />
                                            <button
                                                onClick={() => setProjectCategories(projectCategories.filter((_, idx) => idx !== i))}
                                                className="h-11 px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => setProjectCategories([...projectCategories, { id: "new", label: "New Category" }])} className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs">+ Add Category</button>

                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("projectCategories", projectCategories), "Categories saved", "Failed to save categories.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Categories</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("projectCategories"); setProjectCategories(defaultCategories); }, "Categories reset", "Failed to reset categories.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "homeContent" && (
                            <SectionCard title="Home Page Text" subtitle="Edit every text box shown on home page">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(homeContent).map(([key, value]) => (
                                        <Field key={key} label={key} value={value} onChange={(v) => setHomeContent({ ...homeContent, [key]: v })} />
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("homeContent", homeContent), "Home content saved", "Failed to save home content.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Home Content</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("homeContent"); setHomeContent(defaultHomeContent); }, "Home content reset", "Failed to reset home content.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "aboutContent" && (
                            <SectionCard title="About Page Text" subtitle="Edit all text boxes used on about page">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(aboutContent).map(([key, value]) => (
                                        <Field key={key} label={key} value={value} onChange={(v) => setAboutContent({ ...aboutContent, [key]: v })} />
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-primary/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-text-primary font-semibold">What I Bring Cards</h3>
                                        <button
                                            onClick={() =>
                                                setAboutBentoCards([
                                                    ...aboutBentoCards,
                                                    {
                                                        label: "✨ New",
                                                        title: "New Card",
                                                        description: "Card description",
                                                        mediaType: "none",
                                                        mediaUrl: "",
                                                        points: ["Highlight 1", "Highlight 2"],
                                                        popupTitle: "New Popup Title",
                                                        popupDescription: "More details for popup view",
                                                        popupLink: "",
                                                        popupLinkLabel: "",
                                                    },
                                                ])
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                        >
                                            + Add Card
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {aboutBentoCards.map((card, index) => (
                                            <div key={`${card.title}-${index}`} className="glass rounded-xl p-4 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <Field
                                                        label="Label"
                                                        value={card.label}
                                                        onChange={(v) => {
                                                            const next = [...aboutBentoCards];
                                                            next[index] = { ...next[index], label: v };
                                                            setAboutBentoCards(next);
                                                        }}
                                                    />
                                                    <Field
                                                        label="Title"
                                                        value={card.title}
                                                        onChange={(v) => {
                                                            const next = [...aboutBentoCards];
                                                            next[index] = { ...next[index], title: v };
                                                            setAboutBentoCards(next);
                                                        }}
                                                    />
                                                </div>

                                                <Field
                                                    label="Description"
                                                    rows={2}
                                                    value={card.description}
                                                    onChange={(v) => {
                                                        const next = [...aboutBentoCards];
                                                        next[index] = { ...next[index], description: v };
                                                        setAboutBentoCards(next);
                                                    }}
                                                />

                                                <Field
                                                    label="Popup Title"
                                                    value={card.popupTitle || ""}
                                                    onChange={(v) => {
                                                        const next = [...aboutBentoCards];
                                                        next[index] = { ...next[index], popupTitle: v };
                                                        setAboutBentoCards(next);
                                                    }}
                                                />

                                                <Field
                                                    label="Popup Description"
                                                    rows={3}
                                                    value={card.popupDescription || ""}
                                                    onChange={(v) => {
                                                        const next = [...aboutBentoCards];
                                                        next[index] = { ...next[index], popupDescription: v };
                                                        setAboutBentoCards(next);
                                                    }}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <Field
                                                        label="Popup Link"
                                                        value={card.popupLink || ""}
                                                        onChange={(v) => {
                                                            const next = [...aboutBentoCards];
                                                            next[index] = { ...next[index], popupLink: v };
                                                            setAboutBentoCards(next);
                                                        }}
                                                    />
                                                    <Field
                                                        label="Popup Link Label"
                                                        value={card.popupLinkLabel || ""}
                                                        onChange={(v) => {
                                                            const next = [...aboutBentoCards];
                                                            next[index] = { ...next[index], popupLinkLabel: v };
                                                            setAboutBentoCards(next);
                                                        }}
                                                    />
                                                </div>

                                                <Field
                                                    label="Highlights (comma separated)"
                                                    value={Array.isArray(card.points) ? card.points.join(", ") : ""}
                                                    onChange={(v) => {
                                                        const next = [...aboutBentoCards];
                                                        next[index] = {
                                                            ...next[index],
                                                            points: v
                                                                .split(",")
                                                                .map((item) => item.trim())
                                                                .filter(Boolean),
                                                        };
                                                        setAboutBentoCards(next);
                                                    }}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3">
                                                    <div>
                                                        <label className="block text-text-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Media Type</label>
                                                        <select
                                                            value={card.mediaType || "none"}
                                                            onChange={(e) => {
                                                                const next = [...aboutBentoCards];
                                                                next[index] = { ...next[index], mediaType: e.target.value };
                                                                setAboutBentoCards(next);
                                                            }}
                                                            className={inputClass}
                                                        >
                                                            <option value="none">None</option>
                                                            <option value="image">Image</option>
                                                            <option value="video">Video (auto play)</option>
                                                        </select>
                                                    </div>
                                                    <Field
                                                        label="Media URL"
                                                        placeholder="/projects/my-media.mp4 or image path"
                                                        value={card.mediaUrl || ""}
                                                        onChange={(v) => {
                                                            const next = [...aboutBentoCards];
                                                            next[index] = { ...next[index], mediaUrl: v };
                                                            setAboutBentoCards(next);
                                                        }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 items-end">
                                                    <Field
                                                        label="Media Opacity (0 to 1)"
                                                        type="number"
                                                        value={card.mediaOpacity ?? 0.35}
                                                        onChange={(v) => {
                                                            const raw = Number(v);
                                                            const clamped = Number.isNaN(raw) ? 0.35 : Math.min(1, Math.max(0, raw));
                                                            const next = [...aboutBentoCards];
                                                            next[index] = { ...next[index], mediaOpacity: clamped };
                                                            setAboutBentoCards(next);
                                                        }}
                                                    />
                                                    <p className="text-xs text-text-muted">Lower value makes text clearer by dimming media more.</p>
                                                </div>

                                                <button
                                                    onClick={() => setAboutBentoCards(aboutBentoCards.filter((_, i) => i !== index))}
                                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                                >
                                                    Remove Card
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("aboutContent", aboutContent), "About content saved", "Failed to save about content.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save About Content</button>
                                    <button onClick={() => runEditorAction(async () => saveData("aboutBentoCards", aboutBentoCards), "About cards saved", "Failed to save about cards.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save About Cards</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("aboutContent"); setAboutContent(defaultAboutContent); }, "About content reset", "Failed to reset about content.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("aboutBentoCards"); setAboutBentoCards(defaultAboutBentoCards); }, "About cards reset", "Failed to reset about cards.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset Cards</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "projectsContent" && (
                            <SectionCard title="Projects Page Text" subtitle="Edit all projects page headings and helper text">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(projectsContent).map(([key, value]) => (
                                        <Field key={key} label={key} value={value} onChange={(v) => setProjectsContent({ ...projectsContent, [key]: v })} />
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("projectsContent", projectsContent), "Projects content saved", "Failed to save projects content.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Projects Content</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("projectsContent"); setProjectsContent(defaultProjectsContent); }, "Projects content reset", "Failed to reset projects content.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "contactContent" && (
                            <SectionCard title="Contact Page Text" subtitle="Edit all text boxes shown on contact page">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(contactContent).map(([key, value]) => (
                                        <Field key={key} label={key} value={value} onChange={(v) => setContactContent({ ...contactContent, [key]: v })} />
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => runEditorAction(async () => saveData("contactContent", contactContent), "Contact content saved", "Failed to save contact content.")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold">Save Contact Content</button>
                                    <button onClick={() => runEditorAction(async () => { await resetData("contactContent"); setContactContent(defaultContactContent); }, "Contact content reset", "Failed to reset contact content.")} className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm">Reset</button>
                                </div>
                            </SectionCard>
                        )}

                        {activeTab === "footerContent" && (
                            <SectionCard title="Footer" subtitle="Edit footer brand text, section headings, links, and copyright lines">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field
                                        label="Brand Name"
                                        value={footerContent.brandName}
                                        onChange={(v) => setFooterContent({ ...footerContent, brandName: v })}
                                    />
                                    <Field
                                        label="Quick Links Title"
                                        value={footerContent.quickLinksTitle}
                                        onChange={(v) => setFooterContent({ ...footerContent, quickLinksTitle: v })}
                                    />
                                    <Field
                                        label="Connect Title"
                                        value={footerContent.connectTitle}
                                        onChange={(v) => setFooterContent({ ...footerContent, connectTitle: v })}
                                    />
                                    <Field
                                        label="Copyright Name"
                                        value={footerContent.copyrightName}
                                        onChange={(v) => setFooterContent({ ...footerContent, copyrightName: v })}
                                    />
                                    <Field
                                        label="Copyright Suffix"
                                        value={footerContent.copyrightSuffix}
                                        onChange={(v) => setFooterContent({ ...footerContent, copyrightSuffix: v })}
                                    />
                                    <Field
                                        label="Bottom Right Text"
                                        value={footerContent.builtWithText}
                                        onChange={(v) => setFooterContent({ ...footerContent, builtWithText: v })}
                                    />
                                </div>

                                <Field
                                    label="Brand Description"
                                    rows={3}
                                    value={footerContent.brandDescription}
                                    onChange={(v) => setFooterContent({ ...footerContent, brandDescription: v })}
                                />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-text-primary font-semibold">Quick Links</h3>
                                        <button
                                            onClick={() =>
                                                setFooterContent({
                                                    ...footerContent,
                                                    quickLinks: [...(footerContent.quickLinks || []), { href: "/", label: "New Link" }],
                                                })
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary-light text-xs"
                                        >
                                            + Add Link
                                        </button>
                                    </div>

                                    {(footerContent.quickLinks || []).map((link, i) => (
                                        <div key={`${link.href}-${i}`} className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-2 items-end">
                                            <Field
                                                label="Path"
                                                value={link.href}
                                                onChange={(v) => {
                                                    const next = [...(footerContent.quickLinks || [])];
                                                    next[i] = { ...next[i], href: v };
                                                    setFooterContent({ ...footerContent, quickLinks: next });
                                                }}
                                                placeholder="/about"
                                            />
                                            <Field
                                                label="Label"
                                                value={link.label}
                                                onChange={(v) => {
                                                    const next = [...(footerContent.quickLinks || [])];
                                                    next[i] = { ...next[i], label: v };
                                                    setFooterContent({ ...footerContent, quickLinks: next });
                                                }}
                                                placeholder="About"
                                            />
                                            <button
                                                onClick={() => {
                                                    const next = (footerContent.quickLinks || []).filter((_, idx) => idx !== i);
                                                    setFooterContent({ ...footerContent, quickLinks: next });
                                                }}
                                                className="h-11 px-3 rounded-lg bg-red-500/10 text-red-300 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => runEditorAction(
                                            async () => saveData("footerContent", footerContent),
                                            "Footer saved",
                                            "Failed to save footer content."
                                        )}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold"
                                    >
                                        Save Footer
                                    </button>
                                    <button
                                        onClick={() => runEditorAction(
                                            async () => {
                                                await resetData("footerContent");
                                                setFooterContent(defaultFooterContent);
                                            },
                                            "Footer reset",
                                            "Failed to reset footer content."
                                        )}
                                        className="px-5 py-2.5 rounded-xl glass text-text-secondary text-sm"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </SectionCard>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
