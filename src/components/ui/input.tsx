import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "bg-transparent h-10 w-full min-w-0 text-base px-[15px] py-2 border border-stroke-line rounded-lg transition-[color,box-shadow] outline-none placeholder:text-label-caption",
                "selection:bg-primary selection:text-primary-foreground",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                // "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export { Input }
