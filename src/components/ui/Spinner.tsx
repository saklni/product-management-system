export function Spinner({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-border border-t-primary ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
