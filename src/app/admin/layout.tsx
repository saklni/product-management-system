"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted">
          <Spinner size={32} />
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        session={session}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        <Topbar session={session} onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 p-4 sm:p-7">{children}</div>
      </main>
    </div>
  );
}
