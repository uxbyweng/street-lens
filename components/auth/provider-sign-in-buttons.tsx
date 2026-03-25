"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type ProviderSignInButtonsProps = {
  className?: string;
};

export function ProviderSignInButtons({
  className,
}: ProviderSignInButtonsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        variant="default"
        className="h-15 w-full justify-start gap-3 border-[#dadce0] bg-white px-3 text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#3c4043] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        onClick={() => signIn("google", { redirectTo: "/" })}
      >
        <span className="flex h-7 w-7 items-center justify-center">
          <IconBrandGoogleFilled className="h-7 w-7 text-[#4285F4]" />
        </span>
        <span className="font-medium">Sign in with Google</span>
      </Button>

      <Button
        type="button"
        className="h-15 w-full justify-start gap-3 bg-[#24292f] px-3 text-white hover:bg-[#1b1f23] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        onClick={() => signIn("github", { redirectTo: "/" })}
      >
        <span className="flex h-7 w-7 items-center justify-center">
          <IconBrandGithubFilled className="h-7 w-7 text-white" />
        </span>
        <span className="font-medium">Sign in with GitHub</span>
      </Button>
    </div>
  );
}
