import { ReactNode } from "react";

export function TableContainer({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border [-webkit-overflow-scrolling:touch]">
      <table className="w-full border-collapse min-w-[600px]">{children}</table>
    </div>
  );
}
