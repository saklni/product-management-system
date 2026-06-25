"use client";

import { useState, useEffect } from "react";

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert("Stok tidak mencukupi!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: (item.qty + 1) * item.price,
              }
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
        item.productId === productId
          ? { ...item, qty: newQty, subtotal: newQty * item.price }
          : item
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
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Transaksi Berhasil!");
        setCart([]);
        fetchProducts(); // Refresh products to get updated stock
      } else {
        alert(data.message || "Gagal melakukan transaksi");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  return (
    <div className="products-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kasir (POS)</h1>
          <p className="page-subtitle">Pilih produk dan lakukan transaksi</p>
        </div>
        <div className="search-bar" style={{ width: '300px', margin: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="pos-container">
        {/* Left: Product List */}
        <div className="pos-main">

        <div className="pos-product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="pos-product-card"
              onClick={() => addToCart(product)}
            >
              <div className="pos-product-img-wrapper">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="pos-product-img" />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <h3 className="pos-product-title">{product.name}</h3>
              <p className="pos-product-stock">Stok: {product.stock}</p>
              <p className="pos-product-price">{formatCurrency(product.price)}</p>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500">
              Tidak ada produk yang tersedia.
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="card pos-cart-container">
        <h2 className="pos-cart-title">Keranjang Belanja</h2>

        <div className="pos-cart-items">
          {cart.length === 0 ? (
            <div className="pos-cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Keranjang kosong</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.productId} className="pos-cart-item">
                  <div className="pos-cart-item-info">
                    <h4 className="pos-cart-item-name">{item.productName}</h4>
                    <p className="pos-cart-item-price">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="pos-cart-item-actions">
                    <div className="pos-cart-qty-ctrl">
                      <button
                        className="pos-cart-qty-btn"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <span className="pos-cart-qty-val">{item.qty}</span>
                      <button
                        className="pos-cart-qty-btn"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="pos-cart-delete-btn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="pos-cart-footer">
          <div className="pos-cart-total">
            <span className="pos-cart-total-label">Total</span>
            <span className="pos-cart-total-val">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <button
            className="btn btn-primary pos-cart-checkout-btn"
            disabled={cart.length === 0 || processing}
            onClick={checkout}
          >
            {processing ? (
              <div className="spinner" style={{ width: 20, height: 20, borderTopColor: "white" }} />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                Checkout
              </>
            )}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
