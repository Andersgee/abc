import * as React from "react";

import { cn } from "../utils/cn";

const ButtonDanger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        "bg-red-400 text-red-100 hover:bg-red-500/90",
        "h-10 px-4 py-2",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
ButtonDanger.displayName = "Button";

export { ButtonDanger };
