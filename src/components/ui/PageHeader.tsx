import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight mb-1">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
