import Image from "next/image";

export default function ArtworkDetailLoading() {
  return (
    <div className="flex aspect-video lg:max-h-120 w-full items-center justify-center bg-muted">
      <Image
        src="/images/loading-ghost.gif"
        alt="Loading artwork..."
        width={100}
        height={100}
        unoptimized
      />
    </div>
  );
}
