import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type TextLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    className?: string;
  };

export function TextLink({
  children,
  className,
  target,
  rel,
  ...props
}: TextLinkProps) {
  const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  return (
    <Link
      {...props}
      target={target}
      rel={safeRel}
      className={cn(
        "text-blue-700 underline underline-offset-2 transition-colors hover:text-blue-800",
        className
      )}
    >
      {children}
    </Link>
  );
}
