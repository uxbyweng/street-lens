"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProviderSignInButtonsProps = {
  className?: string;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.56 2.68-3.86 2.68-6.62Z"
      />
      <path
        fill="#4285F4"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.33-1.58-5.04-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3-2.33Z"
      />
      <path
        fill="#34A853"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3 2.33c.71-2.12 2.7-3.7 5.04-3.7Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.48.11-3.08 0 0 .97-.31 3.19 1.18a11.1 11.1 0 0 1 5.8 0c2.21-1.5 3.18-1.18 3.18-1.18.64 1.6.24 2.79.12 3.08.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function ProviderSignInButtons({
  className,
}: ProviderSignInButtonsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        variant="default"
        className="h-15 w-full justify-start gap-3 border-[#dadce0] bg-white px-3 text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#3c4043]"
        onClick={() => signIn("google", { redirectTo: "/" })}
      >
        <span className="flex h-5 w-5 items-center justify-center">
          <GoogleIcon />
        </span>
        <span className="font-medium">Sign in with Google</span>
      </Button>

      <Button
        type="button"
        className="h-15 w-full justify-start gap-3 bg-[#24292f] px-3 text-white hover:bg-[#1b1f23]"
        onClick={() => signIn("github", { redirectTo: "/" })}
      >
        <span className="flex h-5 w-5 items-center justify-center">
          <GitHubIcon />
        </span>
        <span className="font-medium">Sign in with GitHub</span>
      </Button>
    </div>
  );
}
