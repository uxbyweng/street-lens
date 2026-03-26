import Image from "next/image";

export default function ArtworkDetailLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl  bg-black/20 p-6">
        <h1 className="font-fjalla text-center text-xl uppercase text-white mt-15">
          L o a d i n g
        </h1>
        <Image
          src="/images/loading-ghost.gif"
          alt="Loading ghost"
          width={100}
          height={100}
          className="mx-auto mt-15"
        />
      </div>
    </section>
  );
}
