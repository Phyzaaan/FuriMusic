import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";
import { Roboto } from "next/font/google";

import { MusicProvider } from "./musicProvider";
import Header from "./sections/header";
import Sidebar from "./sections/sidebar";
import MusicPlayer from "./sections/musicPlayer";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Furi Music",
  description: "This is my full stack music player web app",
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.className} h-full w-full overflow-hidden`}>
      <body className="bg-dark-bg text-primary flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <MusicProvider>
          <Header />
          <Sidebar />
          <section className="absolute w-full h-full flex items-start justify-center overflow-hidden lg:left-0 lg:max-w-[60%] 2xl:left-auto 2xl:max-w-[40%]">
            <MusicPlayer />
            {children}
          </section>
        </MusicProvider>
      </body>
    </html>
  );
}
