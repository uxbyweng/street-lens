import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl  bg-black/20 p-6">
        <h1 className="font-fjalla text-center text-xl uppercase text-gray-400 mt-10">
          This page does not exist
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
          className="mt-15 mx-auto block cursor-pointer rounded-full px-6"
        >
          <Link href="/">Back to Homepage</Link>
        </Button>
      </div>
    </section>
  );
}
