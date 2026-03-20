import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { UserLocationBootstrap } from "@/components/location/user-location-bootstrap";
import { MapRoutePrefetch } from "@/components/navigation/map-route-prefetch";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STREETLENS",
    template: "%s | STREETLENS",
  },
  description: "Discover and document urban artworks and places.",
  manifest: "/site.webmanifest",
  applicationName: "STREETLENS",
  appleWebApp: {
    title: "STREETLENS",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={cn("font-sans", roboto.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserLocationBootstrap />
        <MapRoutePrefetch />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
