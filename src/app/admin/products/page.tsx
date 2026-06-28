"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { productsApi, categoriesApi, uploadImage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Category, Product, ProductFormState } from "@/types";
import {
  Button,
  PageHeader,
  SearchBar,
  TableContainer,
  Badge,
  StockBadge,
  EmptyState,
  Modal,
  ModalBody,
  ModalFooter,
  FormField,
  FormRow,
  Input,
  Textarea,
  Select,
  Spinner,
  Toast,
  useToast,
} from "@/components/ui";
import { PlusIcon, EditIcon, TrashIcon, BoxIcon, ImagePlaceholderIcon } from "@/components/icons";

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const { toast, showToast } = useToast();

  const fetchProducts = async () => {
    const res = await productsApi.list();
    if (res.success && res.data) setProducts(res.data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await categoriesApi.list();
    if (res.success && res.data) setCategories(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern, fine for this app's scope
    fetchProducts();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId?._id || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId || undefined,
    };

    const res = editingProduct
      ? await productsApi.update(editingProduct._id, body)
      : await productsApi.create(body);

    if (res.success) {
      setShowModal(false);
      fetchProducts();
      showToast({
        message: editingProduct ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan",
        type: "success",
      });
    } else {
      showToast({ message: res.message || "Terjadi kesalahan", type: "error" });
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadImage(file);
    if (result.success && result.url) {
      setForm((prev) => ({ ...prev, imageUrl: result.url as string }));
      showToast({ message: "Gambar berhasil diunggah", type: "success" });
    } else {
      showToast({ message: result.message || "Gagal mengunggah gambar", type: "error" });
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    setDeleting(id);
    const res = await productsApi.remove(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast({ message: "Produk berhasil dihapus", type: "success" });
    } else {
      showToast({ message: res.message || "Gagal menghapus produk", type: "error" });
    }
    setDeleting(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in">
        <Toast toast={toast} />

        <PageHeader
          title="Produk"
          subtitle={`${products.length} produk tersedia`}
          action={
            <Button onClick={openCreateModal}>
              <PlusIcon size={16} />
              Tambah Produk
            </Button>
          }
        />

        <SearchBar
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredProducts.length > 0 ? (
          <TableContainer>
            <thead>
              <tr>
                {["Produk", "Kategori", "Harga", "Stok", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap bg-card">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-card-hover transition-colors duration-150">
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-10 h-10 object-cover rounded-[6px] bg-card-hover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-[6px] bg-card-hover flex items-center justify-center shrink-0">
                          <ImagePlaceholderIcon size={20} className="text-muted" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{product.name}</span>
                        {product.description && (
                          <span className="text-xs text-muted">
                            {product.description.substring(0, 50)}
                            {product.description.length > 50 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <Badge>{product.categoryId?.name || "—"}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border font-mono text-[13px]">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">{product.stock}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-border">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                        <EditIcon size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deleting === product._id}
                        onClick={() => handleDelete(product._id)}
                      >
                        <TrashIcon size={14} />
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableContainer>
        ) : (
          <EmptyState
            icon={<BoxIcon size={48} />}
            message={<>Belum ada produk. Klik tombol &ldquo;Tambah Produk&rdquo; untuk memulai.</>}
          />
        )}
      </div>

      {showModal && (
        <Modal
          title={editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <ModalBody>
              <FormField label="Nama Produk">
                <Input
                  placeholder="Masukkan nama produk"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </FormField>

              <FormField label="Deskripsi">
                <Textarea
                  placeholder="Masukkan deskripsi"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </FormField>

              <FormRow>
                <FormField label="Harga (IDR)">
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    min="0"
                  />
                </FormField>
                <FormField label="Stok">
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                    required
                    min="0"
                  />
                </FormField>
              </FormRow>

              <FormField label="Kategori">
                <Select
                  value={form.categoryId}
                  onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Gambar Produk">
                <div className="flex flex-col">
                  {form.imageUrl && (
                    <Image
                      src={form.imageUrl}
                      alt="Preview"
                      width={100}
                      height={100}
                      unoptimized
                      className="w-[100px] h-[100px] object-cover rounded-md border border-border mb-3"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="p-2"
                  />
                  {uploading && (
                    <span className="text-[13px] text-muted mt-2 block">Mengunggah...</span>
                  )}
                </div>
              </FormField>
            </ModalBody>

            <ModalFooter>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" loading={saving} disabled={uploading}>
                {editingProduct ? "Perbarui" : "Simpan"}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </>
  );
}
