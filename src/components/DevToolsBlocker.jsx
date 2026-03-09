"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
    useEffect(() => {
        // 1. Block right-click
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // 2. Block keyboard shortcuts
        const handleKeyDown = (e) => {
            if (e.key === "F12") { e.preventDefault(); return false; }
            if (e.ctrlKey && e.shiftKey && /[IJCijc]/.test(e.key)) { e.preventDefault(); return false; }
            if (e.ctrlKey && /[UuSsPp]/.test(e.key)) { e.preventDefault(); return false; }
        };

        // 3. Disable text selection (except inputs)
        const handleSelectStart = (e) => {
            if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return true;
            e.preventDefault();
            return false;
        };

        // 4. Disable drag
        const handleDragStart = (e) => { e.preventDefault(); return false; };

        // 5. Disable copy (except inputs)
        const handleCopy = (e) => {
            if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return true;
            e.preventDefault();
            return false;
        };

        // 6. Console flood — clear & warn
        const clearConsole = setInterval(() => {
            console.clear();
            console.log("%c⛔ STOP!", "color:red;font-size:50px;font-weight:bold;text-shadow:2px 2px 0 #000;");
            console.log("%cThis browser feature is for developers. Do not paste anything here.", "font-size:16px;color:#aaa;");
        }, 2000);

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("selectstart", handleSelectStart);
        document.addEventListener("dragstart", handleDragStart);
        document.addEventListener("copy", handleCopy);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("selectstart", handleSelectStart);
            document.removeEventListener("dragstart", handleDragStart);
            document.removeEventListener("copy", handleCopy);
            clearInterval(clearConsole);
        };
    }, []);

    return null;
}
