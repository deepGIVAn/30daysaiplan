import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, ...props }, ref) => (
    <label className="group flex cursor-pointer items-start gap-3.5">
      <div className="relative mt-[3px]">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div
          className={cn(
            "flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-all duration-150",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/25 bg-transparent group-hover:border-foreground/45",
            className,
          )}
        >
          {checked && <Check className="h-[11px] w-[11px]" strokeWidth={3} />}
        </div>
      </div>
      {label && (
        <span
          className={cn(
            "text-[14px] leading-[1.6] transition-colors duration-150",
            checked ? "text-muted-foreground/70 line-through decoration-foreground/20" : "text-foreground/85",
          )}
        >
          {label}
        </span>
      )}
    </label>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
