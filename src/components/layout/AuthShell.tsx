import { ReactNode } from "react";
import { LogoMark } from "@/components/icons";

export function AuthShell({
  gradientId,
  title,
  subtitle,
  children,
  footer,
}: {
  gradientId: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-5">
      {/* Ambient background: blurred color orbs + faint grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full blur-[100px] w-[400px] h-[400px] bg-primary opacity-[0.15] -top-24 -right-24" />
        <div className="absolute rounded-full blur-[100px] w-[350px] h-[350px] bg-secondary opacity-[0.12] -bottom-20 -left-20" />
        <div className="absolute rounded-full blur-[100px] w-[250px] h-[250px] bg-accent opacity-[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex mb-5">
            <LogoMark gradientId={gradientId} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-[15px] text-muted">{subtitle}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 sm:p-7 flex flex-col gap-5">
          {children}
        </div>

        <div className="text-center mt-6 text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}
