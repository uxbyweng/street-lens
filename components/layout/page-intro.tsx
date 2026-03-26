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
};

export function PageIntro({
  title,
  subtitle,
  bgImage,
  action,
  className,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        "mx-auto rounded-2xl px-5 py-8 relative overflow-hidden",
        className
      )}
    >
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#000514]/99 md:from-[#000514]/80 to-[#000514]/60" />
        </>
      ) : null}

      <div className="relative z-10">
        <h1 className="font-fjalla text-6xl md:text-7xl uppercase text-white mt-10 md:mt-5">
          {title}
        </h1>
        <h2 className="font-fjalla text-3xl md:text-4xl w-80 md:w-150 leading-10 md:leading-12 mt-5 md:mt-5 mb-2 font-light text-gray-400">
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
