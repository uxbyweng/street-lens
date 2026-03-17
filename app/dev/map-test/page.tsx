// app/dev/map-test/page.tsx

/* MAP-PICKER TEST */
"use client";

import { MapPicker } from "@/components/map/map-picker";
import { useState } from "react";

export default function TestPage() {
  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <div className="p-4 space-y-4">
      <MapPicker
        latitude={coords?.lat}
        longitude={coords?.lng}
        onChange={(c) => {
          console.log("clicked:", c);
          setCoords(c);
        }}
      />

      <pre>{JSON.stringify(coords, null, 2)}</pre>
    </div>
  );
}

/* USERLOCATION TEST */
// "use client";

// import { useUserLocation } from "@/lib/hooks/use-user-location";

// export default function Page() {
//   const { location, isLoading, error } = useUserLocation();

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return <pre>{JSON.stringify(location, null, 2)}</pre>;
// }
