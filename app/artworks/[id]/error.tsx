"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArtworkDetailErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  console.error(error);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl bg-none p-6">
        <h1 className="font-fjalla text-center text-xl uppercase text-gray-400 mt-10">
          Error while loading artwork details
        </h1>
        <Image
          src="/images/not-found-ghost.gif"
          alt="Loading ghost"
          width={100}
          height={100}
          unoptimized
          className="mx-auto mt-15"
        />

        <Button
          type="button"
          onClick={() => reset()}
          className="mt-15 mx-auto block cursor-pointer rounded-full px-6"
        >
          Try again
        </Button>
      </div>
    </section>
  );
}
