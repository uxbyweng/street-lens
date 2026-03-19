"use client";

import Header from "@/components/layout/header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  // URL-PFad auslesen und in 'pathname' speichern
  const pathname = usePathname();

  // wenn URL '/map' ist setze 'isFullBleedPage' auf true
  const isFullBleedPage = pathname === "/map";
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main
        className={cn(
          "flex-1",
          isFullBleedPage ? "w-full" : "mx-auto w-full max-w-5xl px-4 py-6"
        )}
      >
        {children}
      </main>
    </div>
  );
}
