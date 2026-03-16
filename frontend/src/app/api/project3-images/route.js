import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function naturalSort(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export async function GET() {
    try {
        const projectDir = path.join(process.cwd(), "public", "projects", "project-3-college-event");
        const entries = await readdir(projectDir, { withFileTypes: true });

        const images = entries
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name)
            .filter((name) => allowedExtensions.has(path.extname(name).toLowerCase()))
            .filter((name) => name !== "project-3-placeholder.svg")
            .sort(naturalSort)
            .map((name) => `/projects/project-3-college-event/${name}`);

        return NextResponse.json({ images });
    } catch {
        return NextResponse.json({ images: [] });
    }
}
