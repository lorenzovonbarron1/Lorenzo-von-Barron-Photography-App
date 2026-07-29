/** @type {import('next').NextConfig} */
// Server-capable target (NOT static export) so /api/lead can run
// server-side lead routing, confirmations, and the Auto-Brief pipeline.
// Deploy to any Node host (VPS, Fly, Docker, Vercel) — see DEPLOYMENT.md.
const securityHeaders = [
  // Consumer pages are marketing content; these baseline headers cost
  // nothing and close the common holes.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Lead PII surfaces must never be cached by intermediaries.
      {
        source: "/agent/:path*",
        headers: [...securityHeaders, { key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/:path*",
        headers: [...securityHeaders, { key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
