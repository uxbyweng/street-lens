import Header from "@/components/layout/header";

type MapLayoutProps = {
  children: React.ReactNode;
};

export default function MapLayout({ children }: MapLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 min-h-0 w-full">{children}</main>
    </div>
  );
}
