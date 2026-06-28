"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button, FormField, Input } from "@/components/ui";
import { ErrorAlertIcon } from "@/components/icons";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.register({ name, email, password });

      if (!data.success) {
        setError(data.message || "Gagal membuat akun");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      gradientId="logo-grad-register"
      title={
        <>
          Daftar di <span className="gradient-text">StoreHub</span>
        </>
      }
      subtitle="Buat akun baru untuk mulai mengelola toko"
      footer={
        <p>
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary-hover font-semibold hover:text-primary transition-colors"
          >
            Masuk sekarang
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
        <FormField label="Nama Lengkap">
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email">
          <Input
            id="reg-email"
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
            id="reg-password"
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </FormField>

        <FormField label="Konfirmasi Password">
          <Input
            id="confirm-password"
            type="password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </FormField>

        <Button type="submit" loading={loading} className="w-full h-12 text-[15px] mt-1">
          {loading ? "Memproses..." : "Daftar"}
        </Button>
      </form>
    </AuthShell>
  );
}
