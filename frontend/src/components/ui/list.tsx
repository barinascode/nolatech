
import * as React from "react"
import { cn } from "@/lib/utils"

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("list-disc space-y-1 pl-5", className)} // Basic list styling
    {...props}
  />
))
List.displayName = "List"

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("", className)} // Placeholder for potential item-specific styles
    {...props}
  />
))
ListItem.displayName = "ListItem"

export { List, ListItem }
