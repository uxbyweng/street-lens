import { AuthSessionProvider } from "@/components/auth/session-provider";
import type { Metadata } from "next";
import { Roboto, Fjalla_One } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { UserLocationBootstrap } from "@/components/map/user-location-bootstrap";
import { Toaster } from "@/components/ui/sonner";

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
  title: {
    default: "STREETLENS",
    template: "%s | STREETLENS",
  },
  description: "Explore street art in Berlin.",
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
    <html
      lang="de"
      className={cn("dark font-sans", roboto.variable, fjallaOne.variable)}
    >
      <body>
        <AuthSessionProvider>
          {/* Komponente, die beim Start den 'useUserLocation' Hook lädt,
            um initial zu versuchen, die Standortdaten des Users zu bekommen  */}
          <UserLocationBootstrap />
          {children}
          <Toaster position="top-center" />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
