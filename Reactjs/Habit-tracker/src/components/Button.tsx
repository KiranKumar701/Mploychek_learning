import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type Variant = "primary" | "secondary" | "ghost-destructive"

type ButtonProps = {
  variant?: Variant
} & ComponentProps<"button">

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        "cursor-pointer rounded transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        getVariantStyles(variant),
        className
      )}
    />
  )
}

function getVariantStyles(variant: Variant) {
  switch (variant) {
    case "primary":
      return "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700"
    case "secondary":
      return "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600"
    case "ghost-destructive":
      return "text-red-400 hover:bg-red-500/10 hover:text-red-300"
    default:
      throw new Error(`Invalid variant: ${variant satisfies never}`)
  }
}
