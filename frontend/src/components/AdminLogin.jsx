"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "@/lib/auth";

export default function AdminLogin({ onSuccess, title = "Admin Access" }) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await login(id, password);
            onSuccess();
        } catch (err) {
            const message = err instanceof Error ? err.message : "";
            const normalized = message.toLowerCase();

            if (normalized.includes("invalid credentials")) {
                setError("Invalid credentials. Access denied.");
            } else if (normalized.includes("too many login attempts")) {
                setError(message);
            } else if (normalized.includes("failed to fetch") || normalized.includes("network")) {
                setError("Unable to reach server. Please try again in a moment.");
            } else {
                setError(message || "Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <form
                    onSubmit={handleSubmit}
                    className="glass rounded-2xl p-8 space-y-6"
                >
                    {/* Lock Icon */}
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h2 className="font-display font-bold text-2xl text-text-primary">
                            {title}
                        </h2>
                        <p className="text-text-muted text-sm mt-1">
                            Enter your credentials to continue
                        </p>
                    </div>

                    {/* ID Field */}
                    <div>
                        <label
                            htmlFor="admin-id"
                            className="block text-text-secondary text-sm font-medium mb-2"
                        >
                            ID
                        </label>
                        <input
                            type="text"
                            id="admin-id"
                            required
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-light text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                            placeholder="Enter your ID"
                            autoComplete="off"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="admin-password"
                            className="block text-text-secondary text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="admin-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-surface-light text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            "Access Dashboard"
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
