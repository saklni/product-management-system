import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-md transition-colors duration-200 hover:border-border-hover ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
