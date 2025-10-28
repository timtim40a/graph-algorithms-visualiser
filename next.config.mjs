// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ✅ Skip ESLint checks during Vercel builds
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
