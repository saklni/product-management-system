"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  GridIcon,
  BoxIcon,
  TagIcon,
  CashRegisterIcon,
  ReceiptIcon,
  LogoutIcon,
  LogoMark,
} from "@/components/icons";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: GridIcon },
  { label: "Produk", href: "/admin/products", icon: BoxIcon },
  { label: "Kategori", href: "/admin/categories", icon: TagIcon },
  { label: "Kasir (POS)", href: "/admin/pos", icon: CashRegisterIcon },
  { label: "Riwayat Transaksi", href: "/admin/transactions", icon: ReceiptIcon },
];

export function Sidebar({
  session,
  open,
  onClose,
}: {
  session: Session;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[35] bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[260px] bg-sidebar-bg border-r border-border flex flex-col fixed top-0 left-0 bottom-0 z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoMark size={32} gradientId="sidebar-logo" />
            <span className="text-xl font-extrabold tracking-tight gradient-text">
              StoreHub
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-3 pt-2 pb-1.5 mb-1">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-sm text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-sidebar-active text-primary-hover"
                    : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
                }`}
              >
                <Icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-primary opacity-100" : "opacity-70"}`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-l-[3px]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm shrink-0">
              {session.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold truncate">
                {session.user?.name}
              </span>
              <span className="text-[11px] text-muted truncate">
                {session.user?.email}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Logout"
            className="w-9 h-9 flex items-center justify-center border border-border rounded-sm text-muted cursor-pointer transition-all duration-200 hover:bg-danger/10 hover:border-danger/30 hover:text-danger shrink-0"
          >
            <LogoutIcon size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
