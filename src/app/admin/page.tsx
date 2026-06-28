"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { DashboardStats } from "@/types";
import { Card, Spinner, Badge, StockBadge, EmptyState, TableContainer } from "@/components/ui";
import {
  BoxIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
} from "@/components/icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const res = await dashboardApi.stats();
    if (res.success && res.data) setStats(res.data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern, fine for this app's scope
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size={28} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Produk",
      value: stats?.totalProducts ?? 0,
      icon: BoxIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Kategori",
      value: stats?.totalCategories ?? 0,
      icon: TagIcon,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Total Transaksi",
      value: stats?.totalTransactions ?? 0,
      icon: CheckCircleIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pendapatan Hari Ini",
      value: formatCurrency(stats?.todayRevenue ?? 0),
      icon: ClockIcon,
      color: "text-accent",
      bg: "bg-accent/10",
      isLarge: true,
    },
    {
      label: "Total Pendapatan",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUpIcon,
      color: "text-success",
      bg: "bg-success/10",
      isLarge: true,
    },
    {
      label: "Stok Rendah",
      value: stats?.lowStockProducts ?? 0,
      icon: AlertTriangleIcon,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight mb-1">
          Dashboard
        </h1>
        <p className="text-[15px] text-muted">Ringkasan performa toko Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="p-6 opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div
                className={`font-extrabold tracking-tight mb-1 ${card.isLarge ? "text-[22px]" : "text-3xl"}`}
              >
                {card.value}
              </div>
              <div className="text-[13px] text-muted font-medium">{card.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">Produk Terbaru</h2>
        </div>

        {stats?.recentProducts && stats.recentProducts.length > 0 ? (
          <TableContainer>
            <thead>
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Nama Produk
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Kategori
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Harga
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Stok
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {stats.recentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-card-hover transition-colors duration-150">
                  <td className="px-4 py-3.5 text-sm border-b border-border font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <Badge>{product.categoryId?.name || "Tanpa Kategori"}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border font-mono text-[13px]">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">{product.stock}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <StockBadge stock={product.stock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </TableContainer>
        ) : (
          <EmptyState icon={<BoxIcon size={48} />} message="Belum ada produk. Mulai tambahkan produk pertama Anda!" />
        )}
      </div>
    </div>
  );
}
