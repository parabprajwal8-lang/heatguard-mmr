import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "low" | "moderate" | "high" | "extreme" | "outline";
}

const variantClasses: Record<string, string> = {
  default: "bg-primary-container text-on-primary-container",
  low: "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim",
  moderate: "bg-surface-container-high text-on-surface-variant",
  high: "bg-[#feebc8] text-[#dd6b20]",
  extreme: "bg-secondary-container text-on-secondary-container",
  outline: "border border-outline-variant text-on-surface-variant bg-transparent",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-xs rounded-full px-md py-xs text-label-sm font-label-sm font-bold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
