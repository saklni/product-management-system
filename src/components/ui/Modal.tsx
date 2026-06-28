import { ReactNode } from "react";

/**
 * Modal shell: backdrop + centered (desktop) / bottom-sheet (mobile) card.
 * Compose with <ModalBody> and <ModalFooter> below. For modals that contain
 * a form, wrap a <form> around <ModalBody>+<ModalFooter> yourself so the
 * submit button inside the footer can trigger the form's onSubmit.
 */
export function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-[500px] max-h-[90vh] bg-card border border-border rounded-t-lg sm:rounded-lg flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-7 pt-6 pb-4 border-b border-border shrink-0">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div className="px-7 py-5 overflow-y-auto flex-1 flex flex-col gap-4">
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="px-7 py-5 border-t border-border shrink-0">
      <div className="flex justify-end gap-2.5">{children}</div>
    </div>
  );
}
