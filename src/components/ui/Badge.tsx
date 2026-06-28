import { ReactNode } from "react";

type BadgeVariant = "primary" | "success" | "warning" | "danger";

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-[var(--primary-glow)] text-primary-hover",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function Badge({
  variant = "primary",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

/** Stock badge: Habis / Rendah / Tersedia, driven purely by the stock number. */
export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge variant="danger">Habis</Badge>;
  if (stock <= 5) return <Badge variant="warning">Rendah</Badge>;
  return <Badge variant="success">Tersedia</Badge>;
}
