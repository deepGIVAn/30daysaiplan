import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "outline" | "red";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-fine font-normal",
        variant === "default" && "bg-indigo/15 text-indigo-glow border border-indigo/25",
        variant === "success" && "bg-success/15 text-success border border-success/25",
        variant === "red" && "bg-brand-red/15 text-brand-red border border-brand-red/25",
        variant === "outline" && "border border-border text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
