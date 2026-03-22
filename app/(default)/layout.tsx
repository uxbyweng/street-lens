import Header from "@/components/layout/header";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    // <div className="flex min-h-screen flex-col bg-background text-foreground">
    //   <Header />
    //   <main className="mx-auto flex-1 w-full max-w-5xl px-4 py-6">
    //     {children}
    //   </main>
    // </div>
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 min-h-0 w-full">{children}</main>
    </div>
  );
}
