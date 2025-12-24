import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-[15px] whitespace-nowrap rounded-[10px] text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 p-[15px] border border-b-[5px] border-primary-dark active:border-b-[2px] active:translate-y-[2px]",
        negative:
          "bg-negative text-white hover:bg-negative/90 p-[15px] border border-b-[5px] border-negative-dark active:border-b-[3px] active:translate-y-[2px]",
        secondary:
          "bg-white text-foreground dark:text-black hover:bg-secondary/90 p-[15px] border border-b-[5px] border-stroke-line active:border-b-[3px] active:translate-y-[2px]",
        outline:
          "border border-stroke-border shadow-xs hover:bg-accent hover:text-label-primary dark:hover:bg-accent/50",
        ghost:
          "hover:bg-accent hover:text-label-primary dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[52px]",
        inbutton: "h-9 px-[15px] gap-2",
        sm: "h-10 text-xs font-bold gap-[15px]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-[52px]",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };