"use client";

import { toast } from "sonner";

export function TestToastButton() {
  return (
    <button
      type="button"
      onClick={
        () =>
          toast.success("Test successful.", {
            className: "!bg-green-200 !text-green-700 !border-green-500 mt-15",
          })
        // toast.error("Test failed.", {
        //   className: "!bg-red-200 !text-red-700 !border-red-500",
        // })
      }
      className="mt-4 rounded-md border px-3 py-2 text-sm"
    >
      Show toast
    </button>
  );
}
