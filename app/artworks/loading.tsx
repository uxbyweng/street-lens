import Image from "next/image";

export default function ArtworkListLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl bg-none p-6">
        <h1 className="font-fjalla text-center text-xl uppercase text-gray-400 mt-10">
          Loading artworks ...
        </h1>
        <Image
          src="/images/loading-ghost.gif"
          alt="Loading ghost"
          width={100}
          height={100}
          unoptimized
          className="mx-auto mt-15"
        />
      </div>
    </section>
  );
}
