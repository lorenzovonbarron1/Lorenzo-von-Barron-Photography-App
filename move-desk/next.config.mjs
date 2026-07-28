/** @type {import('next').NextConfig} */
// Server-capable target (NOT static export) so /api/lead can run
// server-side lead routing, confirmations, and the Auto-Brief pipeline.
// Deploy to any Node host (Vercel, Fly, a container).
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
