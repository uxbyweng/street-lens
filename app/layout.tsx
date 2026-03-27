import { AuthSessionProvider } from "@/components/auth/session-provider";
import type { Metadata } from "next";
import { Roboto, Fjalla_One } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { UserLocationBootstrap } from "@/components/map/user-location-bootstrap";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/header";

const fjallaOne = Fjalla_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fjalla-one",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://street-lens.vercel.app"),
  title: {
    default: "STREET LENS",
    template: "%s | STREET LENS",
  },
  description: "Explore street art in Berlin.",
  manifest: "/site.webmanifest",
  applicationName: "STREET LENS",
  appleWebApp: {
    title: "STREET LENS",
  },
  openGraph: {
    title: "STREET LENS",
    description: "Explore street art in Berlin.",
    siteName: "STREET LENS",
    type: "website",
    url: "https://street-lens.vercel.app",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "STREETLENS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STREETLENS",
    description: "Explore street art in Berlin.",
    images: ["/images/og-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={cn("dark font-sans", roboto.variable, fjallaOne.variable)}
    >
      <body>
        <AuthSessionProvider>
          <UserLocationBootstrap />
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1 min-h-0 w-full">{children}</main>
          </div>
          <Toaster position="top-center" />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
