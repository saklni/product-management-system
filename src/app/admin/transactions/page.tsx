"use client";

import { useState, useEffect } from "react";

export default function TransactionsHistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <div className="products-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Riwayat Transaksi</h1>
          <p className="page-subtitle">Daftar seluruh transaksi penjualan</p>
        </div>
      </div>

      <div className="dash-section">
        {loading ? (
          <div className="page-loading">
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : transactions.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Tanggal</th>
                  <th>Total Transaksi</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>
                      <span className="font-medium" style={{ color: "var(--primary)" }}>{tx.invoiceNumber}</span>
                    </td>
                    <td>{formatDate(tx.createdAt)}</td>
                    <td className="mono-cell">{formatCurrency(tx.totalPrice)}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="btn-ghost btn-sm"
                          onClick={() => setSelectedTx(tx)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <p>Belum ada transaksi.</p>
          </div>
        )}
      </div>

      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detail Transaksi</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: 0, marginTop: '4px' }}>
                {selectedTx.invoiceNumber}
              </p>
            </div>
            
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                Tanggal: {formatDate(selectedTx.createdAt)}
              </p>
              
              <div className="tx-item-list-container">
                <h4 className="tx-item-list-title">Daftar Produk</h4>
                <div className="tx-item-list">
                  {selectedTx.items.map((item: any, i: number) => (
                    <div key={i} className="tx-item">
                      <div className="tx-item-info">
                        <span className="tx-item-name">{item.productName}</span>
                        <span className="tx-item-qty">x{item.qty}</span>
                        <div className="tx-item-price">@ {formatCurrency(item.price)}</div>
                      </div>
                      <div className="tx-item-subtotal">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tx-modal-footer-summary">
                <span className="tx-summary-label">Total Keseluruhan</span>
                <span className="tx-summary-val">
                  {formatCurrency(selectedTx.totalPrice)}
                </span>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn-ghost"
                  onClick={() => setSelectedTx(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
