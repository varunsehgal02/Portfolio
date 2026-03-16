/** @type {import('next').NextConfig} */
const backendBase = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

const nextConfig = {
    // Disable source maps in production to avoid exposing original source.
    productionBrowserSourceMaps: false,

    // Minify and optimize output bundles.
    swcMinify: true,

    // Remove most console statements from production client bundles.
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? { exclude: ["error", "warn"] }
                : false,
    },

    // Hide Next.js fingerprint header.
    poweredByHeader: false,

    // Tighten production output to make reverse-reading harder.
    webpack: (config, { dev, isServer }) => {
        if (!dev) {
            config.devtool = false;

            if (!isServer) {
                config.optimization.minimize = true;
                config.optimization.usedExports = true;
                config.optimization.sideEffects = true;
                config.optimization.mangleExports = "deterministic";
            }
        }

        // Allow .glb 3D model file imports
        config.module.rules.push({
            test: /\.glb$/,
            type: "asset/resource",
        });

        return config;
    },

    // Security headers to reduce abuse surface.
    async headers() {
        return [
            {
                source: "/projects/:path*",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                ],
            },
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                ],
            },
        ];
    },

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${backendBase}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
