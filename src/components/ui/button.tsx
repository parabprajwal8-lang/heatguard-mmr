import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-label-md font-label-md transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-on-primary hover:bg-primary-container shadow-level-1",
        secondary:
          "bg-secondary text-on-secondary hover:opacity-90 shadow-level-1",
        outline:
          "border border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-bright hover:border-primary shadow-level-1",
        ghost:
          "text-on-surface-variant hover:bg-surface-bright hover:text-primary",
        danger:
          "bg-error text-on-error hover:opacity-90 shadow-level-1",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-md py-sm min-w-[48px]",
        sm: "h-9 rounded-md px-sm",
        lg: "h-14 rounded-lg px-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
