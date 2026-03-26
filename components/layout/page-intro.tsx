import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  title: string;
  subtitle: string;
  bgImage?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
  contentClassName?: string;
};

export function PageIntro({
  title,
  subtitle,
  bgImage,
  action,
  className,
  contentClassName,
}: PageIntroProps) {
  return (
    <section className={cn("relative overflow-hidden rounded-2xl", className)}>
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#000514]/99 md:from-[#000514]/80 to-[#000514]/60" />
        </>
      ) : null}

      <div
        className={cn(
          "relative z-10 mx-auto max-w-6xl px-5 sm:px-0",
          contentClassName
        )}
      >
        <h1 className="mt-10 font-fjalla text-6xl uppercase text-white md:mt-5 md:text-7xl">
          {title}
        </h1>

        <h2 className="mt-5 mb-2 w-80 font-fjalla text-3xl leading-10 font-light text-gray-400 md:w-150 md:text-4xl md:leading-12">
          {subtitle}
        </h2>

        {action ? (
          <Button asChild className="mt-4">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
