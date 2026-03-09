"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLogin from "@/components/AdminLogin";
import { isAuthenticated, logout } from "@/lib/auth";
import { saveData, getData, resetData, resetAllData } from "@/lib/editableData";
import {
    personalInfo as defaultPersonal,
    skills as defaultSkills,
    experience as defaultExperience,
    education as defaultEducation,
    certifications as defaultCerts,
} from "@/data/personal";
import { projects as defaultProjects } from "@/data/projects";

export default function EditPage() {
    const [authed, setAuthed] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [saved, setSaved] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);

    // Editable state
    const [personal, setPersonal] = useState(defaultPersonal);
    const [projectsList, setProjectsList] = useState(defaultProjects);
    const [skillsData, setSkillsData] = useState(defaultSkills);
    const [experienceData, setExperienceData] = useState(defaultExperience);

    useEffect(() => {
        if (isAuthenticated()) {
            setAuthed(true);
            loadSavedData();
        }
    }, []);

    const loadSavedData = () => {
        setPersonal(getData("personal", defaultPersonal));
        setProjectsList(getData("projects", defaultProjects));
        setSkillsData(getData("skills", defaultSkills));
        setExperienceData(getData("experience", defaultExperience));
    };

    const handleSave = (key, value) => {
        saveData(key, value);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = (key) => {
        resetData(key);
        loadSavedData();
        if (key === "personal") setPersonal(defaultPersonal);
        if (key === "projects") setProjectsList(defaultProjects);
        if (key === "skills") setSkillsData(defaultSkills);
        if (key === "experience") setExperienceData(defaultExperience);
    };

    const handleFileUpload = async (file, projectIndex, fieldName) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                const updated = [...projectsList];
                updated[projectIndex] = { ...updated[projectIndex], [fieldName]: data.url };
                setProjectsList(updated);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    if (!authed) {
        return (
            <AdminLogin
                title="Content Editor"
                onSuccess={() => {
                    setAuthed(true);
                    loadSavedData();
                }}
            />
        );
    }

    const tabs = [
        { id: "personal", label: "Personal Info", icon: "👤", count: null },
        { id: "projects", label: "Projects", icon: "💼", count: projectsList.length },
        { id: "skills", label: "Skills", icon: "🛠️", count: Object.values(skillsData).flat().length },
        { id: "experience", label: "Experience", icon: "📋", count: experienceData.length },
    ];

    const inputClass = "w-full px-4 py-2.5 rounded-xl bg-surface-light border border-surface-light/80 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50";

    return (
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-display font-bold text-3xl sm:text-4xl text-text-primary"
                    >
                        Content <span className="gradient-text">Editor</span>
                    </motion.h1>
                    <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                        </svg>
                        Changes saved to browser localStorage
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Save indicator */}
                    <AnimatePresence>
                        {saved && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20"
                            >
                                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-400 text-xs font-medium">Saved!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => {
                            if (!confirmReset) {
                                setConfirmReset(true);
                                setTimeout(() => setConfirmReset(false), 3000);
                                return;
                            }
                            resetAllData();
                            loadSavedData();
                            setPersonal(defaultPersonal);
                            setProjectsList(defaultProjects);
                            setSkillsData(defaultSkills);
                            setExperienceData(defaultExperience);
                            setConfirmReset(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${confirmReset
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
                            : "glass text-text-secondary hover:text-amber-400 hover:border-amber-400/30"
                            }`}
                    >
                        {confirmReset ? "⚠️ Click again to confirm" : "Reset All"}
                    </button>
                    <button
                        onClick={() => { logout(); setAuthed(false); }}
                        className="px-4 py-2 rounded-xl glass text-text-secondary text-sm hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs with counts */}
            <div className="flex gap-2 mb-8 p-1 rounded-2xl glass inline-flex flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                            : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === tab.id ? "bg-white/20" : "bg-surface-light text-text-muted"}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ===== PERSONAL INFO TAB ===== */}
                {activeTab === "personal" && (
                    <motion.div
                        key="personal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="glass rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary" />
                            <div className="flex items-center justify-between">
                                <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">👤</span>
                                    Personal Information
                                </h3>
                                <button
                                    onClick={() => handleReset("personal")}
                                    className="text-xs text-text-muted hover:text-amber-400 transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: "Name", key: "name", type: "text" },
                                    { label: "Title", key: "title", type: "text" },
                                    { label: "Email", key: "email", type: "email" },
                                    { label: "Phone", key: "phone", type: "text" },
                                    { label: "Location", key: "location", type: "text" },
                                    { label: "Tagline", key: "tagline", type: "text" },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-text-muted text-xs mb-1.5 font-medium uppercase tracking-wider">{field.label}</label>
                                        <input
                                            type={field.type}
                                            value={personal[field.key]}
                                            onChange={(e) => setPersonal({ ...personal, [field.key]: e.target.value })}
                                            className={inputClass}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-text-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Summary</label>
                                <textarea
                                    rows={4}
                                    value={personal.summary}
                                    onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                            <button
                                onClick={() => handleSave("personal", personal)}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Personal Info
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ===== PROJECTS TAB ===== */}
                {activeTab === "projects" && (
                    <motion.div
                        key="projects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {projectsList.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${index % 3 === 0 ? 'from-cyan-500 to-blue-500' : index % 3 === 1 ? 'from-primary to-secondary' : 'from-secondary to-purple-500'}`} />
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display font-semibold text-text-primary flex items-center gap-3">
                                        <span className="text-2xl">{project.icon}</span>
                                        <div>
                                            <span className="block">{project.title || `Project ${index + 1}`}</span>
                                            <span className="text-xs text-text-muted font-normal capitalize">{project.category}</span>
                                        </div>
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const updated = projectsList.filter((_, i) => i !== index);
                                            setProjectsList(updated);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-text-muted text-xs mb-1.5 font-medium">Title</label>
                                        <input
                                            type="text"
                                            value={project.title}
                                            onChange={(e) => {
                                                const updated = [...projectsList];
                                                updated[index] = { ...updated[index], title: e.target.value };
                                                setProjectsList(updated);
                                            }}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-text-muted text-xs mb-1.5 font-medium">Category</label>
                                        <select
                                            value={project.category}
                                            onChange={(e) => {
                                                const updated = [...projectsList];
                                                updated[index] = { ...updated[index], category: e.target.value };
                                                setProjectsList(updated);
                                            }}
                                            className={inputClass}
                                        >
                                            <option value="uiux">UI/UX Design</option>
                                            <option value="graphic">Graphic Design</option>
                                            <option value="motion">Motion Design</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-text-muted text-xs mb-1.5 font-medium">Description</label>
                                    <textarea
                                        rows={3}
                                        value={project.description}
                                        onChange={(e) => {
                                            const updated = [...projectsList];
                                            updated[index] = { ...updated[index], description: e.target.value };
                                            setProjectsList(updated);
                                        }}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-text-muted text-xs mb-1.5 font-medium">Tools (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={project.tools.join(", ")}
                                            onChange={(e) => {
                                                const updated = [...projectsList];
                                                updated[index] = {
                                                    ...updated[index],
                                                    tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                                                };
                                                setProjectsList(updated);
                                            }}
                                            className={inputClass}
                                        />
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {project.tools.map((tool) => (
                                                <span key={tool} className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary-light border border-primary/15">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-text-muted text-xs mb-1.5 font-medium">Project Link (URL)</label>
                                        <input
                                            type="url"
                                            value={project.link || ""}
                                            onChange={(e) => {
                                                const updated = [...projectsList];
                                                updated[index] = { ...updated[index], link: e.target.value };
                                                setProjectsList(updated);
                                            }}
                                            placeholder="https://behance.net/..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Media Uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Image */}
                                    <div>
                                        <label className="block text-text-muted text-xs mb-2 font-medium">Project Image</label>
                                        {project.image ? (
                                            <div className="relative rounded-xl overflow-hidden group/img">
                                                <img src={project.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => {
                                                            const updated = [...projectsList];
                                                            updated[index] = { ...updated[index], image: "" };
                                                            setProjectsList(updated);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs hover:bg-red-500 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-surface-light hover:border-primary/40 cursor-pointer transition-all bg-surface-light/20 hover:bg-surface-light/40 group/upload">
                                                <svg className="w-8 h-8 text-text-muted mb-1 group-hover/upload:text-primary-light transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                                </svg>
                                                <span className="text-text-muted text-xs">Upload Image</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0], index, "image"); }} />
                                            </label>
                                        )}
                                    </div>

                                    {/* Video */}
                                    <div>
                                        <label className="block text-text-muted text-xs mb-2 font-medium">Project Video</label>
                                        {project.video ? (
                                            <div className="relative rounded-xl overflow-hidden group/vid">
                                                <video src={project.video} autoPlay loop muted playsInline className="w-full h-32 object-cover rounded-xl" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => {
                                                            const updated = [...projectsList];
                                                            updated[index] = { ...updated[index], video: "" };
                                                            setProjectsList(updated);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs hover:bg-red-500 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-surface-light hover:border-primary/40 cursor-pointer transition-all bg-surface-light/20 hover:bg-surface-light/40 group/upload">
                                                <svg className="w-8 h-8 text-text-muted mb-1 group-hover/upload:text-primary-light transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                                <span className="text-text-muted text-xs">Upload Video</span>
                                                <input type="file" accept="video/*" className="hidden" onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0], index, "video"); }} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => {
                                    const newProject = {
                                        id: `project-${Date.now()}`,
                                        title: "New Project",
                                        category: "uiux",
                                        description: "Project description...",
                                        highlights: ["Highlight 1", "Highlight 2"],
                                        tools: ["Figma"],
                                        gradient: "from-indigo-500 via-purple-500 to-pink-500",
                                        icon: "🆕",
                                        link: "",
                                        image: "",
                                        video: "",
                                    };
                                    setProjectsList([...projectsList, newProject]);
                                }}
                                className="px-6 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary-light text-sm font-semibold hover:bg-primary/5 hover:border-primary/50 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Project
                            </button>
                            <button
                                onClick={() => handleSave("projects", projectsList)}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save All Projects
                            </button>
                            <button
                                onClick={() => handleReset("projects")}
                                className="text-xs text-text-muted hover:text-amber-400 transition-colors py-2 flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ===== SKILLS TAB ===== */}
                {activeTab === "skills" && (
                    <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {Object.entries(skillsData).map(([category, items], i) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary" />
                                <h3 className="font-display font-semibold text-text-primary flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🎯</span>
                                    {category}
                                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-surface-light text-text-muted font-normal">{items.length} skills</span>
                                </h3>
                                <div>
                                    <label className="block text-text-muted text-xs mb-1.5 font-medium">Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={items.join(", ")}
                                        onChange={(e) => {
                                            const updated = { ...skillsData };
                                            updated[category] = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                            setSkillsData(updated);
                                        }}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 rounded-lg text-xs bg-surface-light text-text-secondary border border-surface-light hover:border-primary/30 hover:text-primary-light transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => handleSave("skills", skillsData)}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Skills
                            </button>
                            <button
                                onClick={() => handleReset("skills")}
                                className="text-xs text-text-muted hover:text-amber-400 transition-colors py-2 flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ===== EXPERIENCE TAB ===== */}
                {activeTab === "experience" && (
                    <motion.div
                        key="experience"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {experienceData.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary" />
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display font-semibold text-text-primary flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">💼</span>
                                        <div>
                                            <span className="block">{exp.role || `Experience ${index + 1}`}</span>
                                            <span className="text-xs text-text-muted font-normal">{exp.company} · {exp.period}</span>
                                        </div>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "Role", key: "role" },
                                        { label: "Company", key: "company" },
                                        { label: "Period", key: "period" },
                                        { label: "Location", key: "location" },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-text-muted text-xs mb-1.5 font-medium">{field.label}</label>
                                            <input
                                                type="text"
                                                value={exp[field.key]}
                                                onChange={(e) => {
                                                    const updated = [...experienceData];
                                                    updated[index] = { ...updated[index], [field.key]: e.target.value };
                                                    setExperienceData(updated);
                                                }}
                                                className={inputClass}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-text-muted text-xs mb-1.5 font-medium">Highlights (one per line)</label>
                                    <textarea
                                        rows={4}
                                        value={exp.highlights.join("\n")}
                                        onChange={(e) => {
                                            const updated = [...experienceData];
                                            updated[index] = {
                                                ...updated[index],
                                                highlights: e.target.value.split("\n").filter(Boolean),
                                            };
                                            setExperienceData(updated);
                                        }}
                                        className={`${inputClass} resize-none`}
                                    />
                                    <div className="mt-2 space-y-1">
                                        {exp.highlights.map((h, hi) => (
                                            <div key={hi} className="flex items-start gap-2 text-xs text-text-secondary">
                                                <span className="text-primary-light mt-0.5">•</span>
                                                <span>{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => handleSave("experience", experienceData)}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Experience
                            </button>
                            <button
                                onClick={() => handleReset("experience")}
                                className="text-xs text-text-muted hover:text-amber-400 transition-colors py-2 flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass rounded-xl p-4 text-center mt-8">
                <p className="text-text-muted text-xs flex items-center justify-center gap-2">
                    <span>⚠️</span>
                    Changes are saved to browser localStorage and persist on this device only. Refresh portfolio pages to see updates.
                </p>
            </div>
        </div>
    );
}
