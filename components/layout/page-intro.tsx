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
    <section className={cn("mx-auto rounded-2xl px-5 py-8", className)}>
      <h1 className="font-fjalla text-4xl font-semibold uppercase">{title}</h1>
      <p className="mt-3 text-pink-500 text-lg mb-2">{subtitle}</p>

      {action ? (
        <Button asChild className="mt-4">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </section>
  );
}
