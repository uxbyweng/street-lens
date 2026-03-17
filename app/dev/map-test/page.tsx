// app/dev/map-test/page.tsx

"use client";

import { useUserLocation } from "@/lib/hooks/use-user-location";

export default function Page() {
  const { location, isLoading, error } = useUserLocation();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <pre>{JSON.stringify(location, null, 2)}</pre>;
}
