import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for multi-stage Docker builds — produces a self-contained server
  output: "standalone",

  // Allow images from external sources used by property listings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.noblenests.co",
      },
    ],
    // WebP optimisation for all images
    formats: ["image/webp", "image/avif"],
  },

  // Strict security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Immutable caching for Next.js static assets
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Rewrite /admin to the correct brand path so it works in both dev and prod
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/noblenestsco/admin/:path*",
      },
      {
        source: "/api/:path*",
        destination: "/noblenestsco/api/:path*",
      },
    ];
  },

  // Redirect www → non-www (enforced at Nginx level too for redundancy)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.noblenests.co" }],
        destination: "https://noblenests.co/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
