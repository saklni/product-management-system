"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button, FormField, Input } from "@/components/ui";
import { ErrorAlertIcon } from "@/components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      gradientId="logo-grad-login"
      title={
        <>
          Masuk ke <span className="gradient-text">StoreHub</span>
        </>
      }
      subtitle="Kelola produk dan toko Anda dengan mudah"
      footer={
        <p>
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary-hover font-semibold hover:text-primary transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      }
    >
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-sm text-sm bg-danger/[0.08] border border-danger/20 text-danger animate-scale-in">
          <ErrorAlertIcon />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField label="Email">
          <Input
            id="email"
            type="email"
            placeholder="admin@storehub.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </FormField>

        <Button type="submit" loading={loading} className="w-full h-12 text-[15px] mt-1">
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </AuthShell>
  );
}
