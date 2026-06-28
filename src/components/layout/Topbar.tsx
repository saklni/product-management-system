"use client";

import type { Session } from "next-auth";
import { MenuIcon } from "@/components/icons";

export function Topbar({
  session,
  onOpenSidebar,
}: {
  session: Session;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="h-[60px] border-b border-border flex items-center justify-between px-4 sm:px-7 bg-[rgba(10,10,15,0.85)] backdrop-blur-sm sticky top-0 z-20">
      <button
        className="md:hidden text-foreground cursor-pointer p-1"
        onClick={onOpenSidebar}
      >
        <MenuIcon size={22} />
      </button>
      <div className="ml-auto text-sm text-muted-foreground">
        Halo, <strong className="text-foreground">{session.user?.name?.split(" ")[0]}</strong> 👋
      </div>
    </header>
  );
}
