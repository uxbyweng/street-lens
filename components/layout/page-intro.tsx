import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  title: string;
  subtitle: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
};

export function PageIntro({
  title,
  subtitle,
  action,
  className,
}: PageIntroProps) {
  return (
    <section className={cn("mx-auto rounded-2xl p-2", className)}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>

      {action ? (
        <Button asChild className="mt-4">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </section>
  );
}
