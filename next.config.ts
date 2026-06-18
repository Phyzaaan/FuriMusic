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
      new URL(
        "https://omdzngdkqxzjgodfrjlf.supabase.co/storage/v1/object/public/songsBanner/**",
      ),
      new URL(
        "https://omdzngdkqxzjgodfrjlf.supabase.co/storage/v1/object/public/artistsBanner/**",
      ),
      new URL(
        "https://omdzngdkqxzjgodfrjlf.supabase.co/storage/v1/object/public/songs/**",
      ),
      new URL(
        "https://omdzngdkqxzjgodfrjlf.supabase.co/storage/v1/object/public/playlistsBanner/**",
      ),
    ],
  },
};
export default nextConfig;
