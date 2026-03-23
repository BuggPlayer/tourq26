import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
      {
        source: "/admin/hub/nodejs",
        destination: "/admin/hub/interview-banks/nodejs",
        permanent: false,
      },
      {
        source: "/admin/hub/nodejs/categories",
        destination: "/admin/hub/interview-banks/nodejs/categories",
        permanent: false,
      },
      {
        source: "/admin/hub/nodejs/new",
        destination: "/admin/hub/interview-banks/nodejs/new",
        permanent: false,
      },
      {
        source: "/admin/hub/nodejs/edit/:path*",
        destination: "/admin/hub/interview-banks/nodejs/edit/:path*",
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
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
