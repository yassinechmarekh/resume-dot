import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

interface Props extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, type, error, ...props }: Props) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-green-700 selection:text-white border-input h-9 w-full min-w-0 rounded-sm border bg-white px-3 py-1 text-sm xs:text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[1.5px] focus-visible:border-green-700 focus-visible:text-green-700 focus-visible:placeholder:text-green-700",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        error && "text-red-500 placeholder:text-red-500 [&_svg]:text-red-500 focus-visible:text-red-500 focus-visible:placeholder:text-red-500 selection:bg-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
