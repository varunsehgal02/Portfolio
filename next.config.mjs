/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable source maps in production so code is not visible
    productionBrowserSourceMaps: false,

    // Minify and optimize
    swcMinify: true,

    // Custom webpack config to strip source maps in dev too
    webpack: (config, { dev }) => {
        if (!dev) {
            config.devtool = false;
        }
        return config;
    },

    // Security headers to prevent framing, sniffing, etc.
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                ],
            },
        ];
    },
};

export default nextConfig;
