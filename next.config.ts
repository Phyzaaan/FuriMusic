import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: [
    "10.66.15.115",
    "192.168.240.37",
    "192.168.240.141",
    "192.168.222.37",
    '10.144.2.115',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'omdzngdkqxzjgodfrjlf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
