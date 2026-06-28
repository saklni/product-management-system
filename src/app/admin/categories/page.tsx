"use client";

import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Category, CategoryFormState } from "@/types";
import {
  Button,
  PageHeader,
  EmptyState,
  Modal,
  ModalBody,
  ModalFooter,
  FormField,
  Input,
  Textarea,
  Spinner,
  Toast,
  useToast,
} from "@/components/ui";
import { PlusIcon, EditIcon, TrashIcon, TagIcon } from "@/components/icons";

const emptyForm: CategoryFormState = { name: "", description: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const { toast, showToast } = useToast();

  const fetchCategories = async () => {
    const res = await categoriesApi.list();
    if (res.success && res.data) setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern, fine for this app's scope
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({ name: category.name, description: category.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = editingCategory
      ? await categoriesApi.update(editingCategory._id, form)
      : await categoriesApi.create(form);

    if (res.success) {
      setShowModal(false);
      fetchCategories();
      showToast({
        message: editingCategory ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan",
        type: "success",
      });
    } else {
      showToast({ message: res.message || "Terjadi kesalahan", type: "error" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    setDeleting(id);
    const res = await categoriesApi.remove(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
      showToast({ message: "Kategori berhasil dihapus", type: "success" });
    } else {
      showToast({ message: res.message || "Gagal menghapus kategori", type: "error" });
    }
    setDeleting(null);
  };

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
          title="Kategori"
          subtitle={`${categories.length} kategori tersedia`}
          action={
            <Button onClick={openCreateModal}>
              <PlusIcon size={16} />
              Tambah Kategori
            </Button>
          }
        />

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, i) => (
              <div
                key={category._id}
                className="bg-card border border-border rounded-md transition-colors duration-200 hover:border-border-hover p-5 opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-[10px] bg-secondary/10 text-secondary flex items-center justify-center">
                    <TagIcon size={22} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      title="Edit"
                      onClick={() => openEditModal(category)}
                      className="w-[30px] h-[30px] flex items-center justify-center rounded-md text-muted cursor-pointer transition-all duration-150 hover:bg-card-hover hover:text-foreground"
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      title="Hapus"
                      disabled={deleting === category._id}
                      onClick={() => handleDelete(category._id)}
                      className="w-[30px] h-[30px] flex items-center justify-center rounded-md text-muted cursor-pointer transition-all duration-150 hover:bg-danger/10 hover:text-danger"
                    >
                      {deleting === category._id ? <Spinner size={14} /> : <TrashIcon size={14} />}
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-bold tracking-tight mb-1.5">{category.name}</h3>
                {category.description && (
                  <p className="text-[13px] text-muted leading-relaxed mb-3">{category.description}</p>
                )}
                <div className="text-xs text-muted">{formatDate(category.createdAt)}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<TagIcon size={48} />}
            message={<>Belum ada kategori. Klik tombol &ldquo;Tambah Kategori&rdquo; untuk memulai.</>}
          />
        )}
      </div>

      {showModal && (
        <Modal
          title={editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <ModalBody>
              <FormField label="Nama Kategori">
                <Input
                  placeholder="Masukkan nama kategori"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Deskripsi">
                <Textarea
                  placeholder="Masukkan deskripsi kategori (opsional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </FormField>
            </ModalBody>

            <ModalFooter>
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" loading={saving}>
                {editingCategory ? "Perbarui" : "Simpan"}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </>
  );
}
