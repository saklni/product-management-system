"use client";

import { useState, useEffect } from "react";
import { transactionsApi } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Transaction } from "@/types";
import {
  Button,
  PageHeader,
  EmptyState,
  TableContainer,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@/components/ui";
import { EyeIcon, ReceiptIcon } from "@/components/icons";

export default function TransactionsHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    const res = await transactionsApi.list();
    if (res.success && res.data) setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern, fine for this app's scope
    fetchTransactions();
  }, []);

  return (
    <>
      <div className="animate-fade-in">
        <PageHeader title="Riwayat Transaksi" subtitle="Daftar seluruh transaksi penjualan" />

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size={28} />
          </div>
        ) : transactions.length > 0 ? (
          <TableContainer>
            <thead>
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  No. Invoice
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Tanggal
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Total Transaksi
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-card-hover transition-colors duration-150">
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <span className="font-semibold text-primary">{tx.invoiceNumber}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    {formatDateTime(tx.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border font-mono text-[13px]">
                    {formatCurrency(tx.totalPrice)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTx(tx)}>
                        <EyeIcon size={14} />
                        Detail
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableContainer>
        ) : (
          <EmptyState icon={<ReceiptIcon size={48} />} message="Belum ada transaksi." />
        )}
      </div>

      {selectedTx && (
        <Modal
          title="Detail Transaksi"
          subtitle={selectedTx.invoiceNumber}
          onClose={() => setSelectedTx(null)}
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">
              Tanggal: {formatDateTime(selectedTx.createdAt)}
            </p>

            <div className="bg-input-bg border border-border rounded-md p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Daftar Produk
              </h4>
              <div className="flex flex-col gap-3">
                {selectedTx.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-muted ml-2">x{item.qty}</span>
                      <div className="text-xs text-muted mt-0.5">@ {formatCurrency(item.price)}</div>
                    </div>
                    <div className="font-semibold">{formatCurrency(item.subtotal)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="font-medium text-muted-foreground">Total Keseluruhan</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(selectedTx.totalPrice)}
              </span>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedTx(null)}>
              Tutup
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
