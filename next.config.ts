import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tools",
        destination: "/dev-tools",
        permanent: true,
      },
      {
        source: "/tools/:path*",
        destination: "/dev-tools",
        permanent: true,
      },
      {
        source: "/hub/candidate/nodejs-interview",
        destination: "/hub/candidate/interview/nodejs",
        permanent: false,
      },
      {
        source: "/hub/candidate/nodejs-interview/:path*",
        destination: "/hub/candidate/interview/nodejs/:path*",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Skip `/_next/*` so hashed CSS/JS chunks keep Next’s `Content-Type` (avoids nosniff + wrong MIME in dev).
        source: "/((?!_next/).*)",
        headers: [
          // SAMEORIGIN allows same-site iframes (e.g. admin live preview of /dev-tools/*) while blocking embeds on other domains.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
