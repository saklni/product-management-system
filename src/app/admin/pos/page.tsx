"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { productsApi, transactionsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Product, TransactionItem } from "@/types";
import { Button, SearchBar, Card, Spinner } from "@/components/ui";
import { CartIcon, CartCheckoutIcon, TrashIcon } from "@/components/icons";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    const res = await productsApi.list();
    if (res.success && res.data) setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern, fine for this app's scope
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert("Stok tidak mencukupi!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          productName: product.name,
          price: product.price,
          qty: 1,
          subtotal: product.price,
        },
      ]);
    }
  };

  const updateQty = (productId: string, newQty: number) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    if (newQty > product.stock) {
      alert("Stok tidak mencukupi!");
      return;
    }
    if (newQty < 1) return;

    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, qty: newQty, subtotal: newQty * item.price } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const checkout = async () => {
    if (cart.length === 0) return;

    setProcessing(true);
    const res = await transactionsApi.create({ items: cart, totalPrice });
    if (res.success) {
      alert("Transaksi Berhasil!");
      setCart([]);
      fetchProducts();
    } else {
      alert(res.message || "Gagal melakukan transaksi");
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight mb-1">Kasir (POS)</h1>
          <p className="text-sm text-muted">Pilih produk dan lakukan transaksi</p>
        </div>
        <SearchBar
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[300px] mb-0"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Product List */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                onClick={() => addToCart(product)}
                className="p-4 cursor-pointer flex flex-col hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
              >
                <div className="w-full h-32 bg-input-bg border border-border rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={160}
                      height={128}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted text-sm">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-muted mb-2">Stok: {product.stock}</p>
                <p className="font-bold text-primary mt-auto">{formatCurrency(product.price)}</p>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted text-sm">
                Tidak ada produk yang tersedia.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart */}
        <Card className="w-full lg:w-96 flex flex-col p-6">
          <h2 className="text-xl font-bold mb-6">Keranjang Belanja</h2>

          <div className="flex-1 overflow-y-auto mb-6 flex flex-col gap-4 max-h-[50vh] lg:max-h-none">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted gap-2 py-8">
                <CartIcon size={48} />
                <p>Keranjang kosong</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center p-3 bg-input-bg rounded-md border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate w-32">{item.productName}</h4>
                    <p className="text-xs text-muted">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-input-bg rounded border border-border">
                      <button
                        className="px-2 py-1 hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-medium w-8 text-center">{item.qty}</span>
                      <button
                        className="px-2 py-1 hover:bg-card-hover"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="p-1.5 text-danger rounded hover:bg-danger-hover hover:text-white"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
            </div>
            <Button
              className="w-full py-3"
              disabled={cart.length === 0}
              loading={processing}
              onClick={checkout}
            >
              {!processing && (
                <>
                  <CartCheckoutIcon size={20} />
                  Checkout
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
