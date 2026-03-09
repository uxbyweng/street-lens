import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto max-w-2xl rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold primary">
          STREET<span className="accent">LENS</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A mobile-first app to collect, manage, and discover urban spots with
          images, notes, and location data.
        </p>

        <div className="mt-6">
          <Button>Start exploring</Button>
        </div>
      </section>
    </AppShell>
  );
}
