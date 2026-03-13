import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="de">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
