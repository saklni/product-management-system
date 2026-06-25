"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalValue: number;
  lowStockProducts: number;
  recentProducts: any[];
  totalTransactions: number;
  totalRevenue: number;
  todayRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Produk",
      value: stats?.totalProducts || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Kategori",
      value: stats?.totalCategories || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ),
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      label: "Total Transaksi",
      value: stats?.totalTransactions || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Pendapatan Hari Ini",
      value: formatCurrency(stats?.todayRevenue || 0),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "#14b8a6",
      bgColor: "rgba(20, 184, 166, 0.1)",
      isLarge: true,
    },
    {
      label: "Total Pendapatan",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      isLarge: true,
    },
    {
      label: "Stok Rendah",
      value: stats?.lowStockProducts || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div className="dashboard animate-fade-in">
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">Ringkasan performa toko Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="stat-card card"
            style={{
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="stat-card-header">
              <div
                className="stat-icon"
                style={{
                  background: card.bgColor,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: card.isLarge ? "22px" : "32px" }}>
              {card.value}
            </div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">Produk Terbaru</h2>
        </div>

        {stats?.recentProducts && stats.recentProducts.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((product: any) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-name-cell">
                        <span className="product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {product.categoryId?.name || "Tanpa Kategori"}
                      </span>
                    </td>
                    <td className="price-cell">{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.stock <= 0 ? (
                        <span className="badge badge-danger">Habis</span>
                      ) : product.stock <= 5 ? (
                        <span className="badge badge-warning">Rendah</span>
                      ) : (
                        <span className="badge badge-success">Tersedia</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <p>Belum ada produk. Mulai tambahkan produk pertama Anda!</p>
          </div>
        )}
      </div>
    </div>
  );
}
