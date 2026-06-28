import { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({
  icon,
  message,
}: {
  icon: ReactNode;
  message: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 p-12 text-center text-sm text-muted">
      <div className="text-muted">{icon}</div>
      <p>{message}</p>
    </Card>
  );
}
