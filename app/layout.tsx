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
  metadataBase: new URL("https://www.berlin-street-view.de/"),
  title: {
    default: "BERLIN STREET VIEW",
    template: "%s | BERLIN STREET VIEW",
  },
  description: "Explore street art in Berlin.",
  manifest: "/site.webmanifest",
  applicationName: "BERLIN STREET VIEW",
  appleWebApp: {
    title: "BERLIN STREET VIEW",
  },
  openGraph: {
    title: "BERLIN STREET VIEW",
    description: "Explore street art in Berlin.",
    siteName: "BERLIN STREET VIEW",
    type: "website",
    url: "https://www.berlin-street-view.de/",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "BERLIN STREET VIEW",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BERLIN STREET VIEW",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <AuthSessionProvider>
          <UserLocationBootstrap />
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main id="main-content" className="flex-1 min-h-0 w-full">
              {children}
            </main>
          </div>
          <Toaster position="top-center" />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
