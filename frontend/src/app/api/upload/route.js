import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const maxBytes = 20 * 1024 * 1024;
        if (file.size > maxBytes) {
            return NextResponse.json({ error: "File too large. Max size is 20MB." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create projects directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public", "projects");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
        const uniqueName = `${baseName}_${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            url: `/projects/${uniqueName}`,
            name: uniqueName,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
