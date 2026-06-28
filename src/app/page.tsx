"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} />
        <p className="text-sm text-muted">Memuat...</p>
      </div>
    </div>
  );
}
