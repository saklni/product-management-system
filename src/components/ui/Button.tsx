import { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "danger" | "ghost";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-primary to-secondary text-white hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_var(--primary-glow)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0",
  danger:
    "bg-danger text-white hover:bg-danger-hover disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-muted-foreground border border-border hover:bg-card-hover hover:text-foreground hover:border-border-hover disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm font-semibold rounded-sm",
  sm: "px-3 py-1.5 text-xs font-medium rounded-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}
