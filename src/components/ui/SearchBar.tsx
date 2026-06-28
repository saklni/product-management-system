import { InputHTMLAttributes } from "react";
import { SearchIcon } from "@/components/icons";

export function SearchBar({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={`flex items-center gap-3 px-4 bg-input-bg border border-input-border rounded-sm mb-5 transition-colors duration-200 focus-within:border-input-focus focus-within:shadow-[0_0_0_3px_var(--primary-glow)] ${className}`}
    >
      <SearchIcon size={18} className="text-muted shrink-0" />
      <input
        type="text"
        className="flex-1 bg-transparent border-none py-3 text-sm text-foreground outline-none placeholder:text-muted"
        {...props}
      />
    </div>
  );
}
