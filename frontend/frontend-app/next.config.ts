import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites () {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/:path*',
        },
      ];
    }
    return [];
  },
  
  /* config options here */
  reactCompiler: true,
};



export default nextConfig;
