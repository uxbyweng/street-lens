"use client";

import type { CSSProperties } from "react";
import {
  IconCircleCheck,
  IconInfoCircle,
  IconLoader2,
  IconCircleX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-5" />,
        info: <IconInfoCircle className="size-5" />,
        warning: <IconAlertTriangle className="size-5" />,
        error: <IconCircleX className="size-5" />,
        loading: <IconLoader2 className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
