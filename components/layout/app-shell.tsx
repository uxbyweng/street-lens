import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
