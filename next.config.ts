/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/movies/images/**",
      },
      {
        protocol: "https",
        hostname: "my-backend-lpu5.onrender.com",
        pathname: "/media/movies/images/**",
      },
    ],
  },
  // Optionally ignore ESLint warnings during builds (uncomment if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable strict React mode for better error catching (optional)
  reactStrictMode: true,
  // Enable TypeScript strict mode (optional, if you're using TypeScript)
  typescript: {
    // Warn about TypeScript errors but don't fail the build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;