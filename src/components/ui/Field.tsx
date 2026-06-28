import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const fieldClasses =
  "w-full px-4 py-3 bg-input-bg border border-input-border rounded-sm text-foreground text-sm outline-none transition-all duration-200 placeholder:text-muted focus:border-input-focus focus:shadow-[0_0_0_3px_var(--primary-glow)]";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClasses} ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={`${fieldClasses} resize-y ${className}`} {...props} />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${fieldClasses} cursor-pointer ${className}`} {...props}>
      {children}
    </select>
  );
}
