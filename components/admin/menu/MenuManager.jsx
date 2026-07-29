"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  createCategory,
  updateCategory,
  updateCategoryTranslation,
  deleteCategory,
  reorderCategories,
  createProduct,
  updateProduct,
  updateProductTranslation,
  deleteProduct,
  reorderProducts,
} from "@/lib/menu/actions";
import CategoryRow from "./CategoryRow";
import ProductRow from "./ProductRow";
import CategoryFormModal from "./CategoryFormModal";
import ProductFormModal from "./ProductFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import styles from "./MenuManager.module.css";
import { LOCALES } from "@/lib/menu/constants";

export default function MenuManager({ initialCategories }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategories[0]?.id ?? null
  );
  const [categoryModal, setCategoryModal] = useState(null); // "new" | category object | null
  const [productModal, setProductModal] = useState(null); // { mode: "new"|"edit", productId } | null
  const [confirmTarget, setConfirmTarget] = useState(null); // { type, id, label }
  const [confirmPending, setConfirmPending] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleCategoryDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);
    await reorderCategories(reordered.map((c) => c.id));
    refresh();
  }

  async function handleProductDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedCategory) return;
    const items = selectedCategory.products;
    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setCategories((prev) =>
      prev.map((c) => (c.id === selectedCategory.id ? { ...c, products: reordered } : c))
    );
    await reorderProducts(selectedCategory.id, reordered.map((p) => p.id));
    refresh();
  }

  async function handleSaveCategory(payload) {
    if (payload.id) {
      await updateCategory(payload.id, { active: payload.active });
      for (const locale of LOCALES) {
        await updateCategoryTranslation(payload.id, locale, payload.translations[locale]);
      }
    } else {
      await createCategory({ slug: payload.slug, translations: payload.translations });
    }
    setCategoryModal(null);
    refresh();
  }

  async function handleSaveProduct(payload) {
    if (payload.id) {
      await updateProduct(payload.id, payload.fields);
      await updateProductTranslation(payload.id, payload.locale, payload.translation);
      refresh();
      return;
    }

    const product = await createProduct({
      categoryId: payload.categoryId,
      slug: payload.slug,
      price: payload.fields.price,
      currency: payload.fields.currency,
    });
    await updateProduct(product.id, payload.fields);
    for (const locale of LOCALES) {
      await updateProductTranslation(product.id, locale, payload.translations[locale]);
    }
    setProductModal({ mode: "edit", productId: product.id, categoryId: payload.categoryId });
    refresh();
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmPending(true);
    try {
      if (confirmTarget.type === "category") {
        await deleteCategory(confirmTarget.id);
        if (selectedCategoryId === confirmTarget.id) setSelectedCategoryId(null);
      } else {
        await deleteProduct(confirmTarget.id);
      }
      setConfirmTarget(null);
      refresh();
    } finally {
      setConfirmPending(false);
    }
  }

  const editingProduct =
    productModal?.mode === "edit"
      ? selectedCategory?.products.find((p) => p.id === productModal.productId) ||
        categories.flatMap((c) => c.products).find((p) => p.id === productModal.productId)
      : null;

  return (
    <div>
      <div className={styles.layout}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Kategoriler</span>
            <button
              type="button"
              className="admin-btn admin-btn--primary admin-btn--sm"
              onClick={() => setCategoryModal("new")}
            >
              + Ekle
            </button>
          </div>

          {categories.length === 0 ? (
            <p className={styles.empty}>Henüz kategori yok.</p>
          ) : (
            <DndContext
              id="categories-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((cat) => (
                  <CategoryRow
                    key={cat.id}
                    category={cat}
                    active={cat.id === selectedCategoryId}
                    onSelect={() => setSelectedCategoryId(cat.id)}
                    onEdit={() => setCategoryModal(cat)}
                    onDelete={() =>
                      setConfirmTarget({
                        type: "category",
                        id: cat.id,
                        label: `"${cat.translations.tr?.name || cat.slug}" kategorisi ve içindeki tüm ürünler silinecek.`,
                      })
                    }
                    onToggleActive={() => {
                      setCategories((prev) =>
                        prev.map((c) => (c.id === cat.id ? { ...c, active: !c.active } : c))
                      );
                      updateCategory(cat.id, { active: !cat.active }).then(refresh);
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>
              {selectedCategory
                ? selectedCategory.translations.tr?.name || selectedCategory.slug
                : "Ürünler"}
            </span>
            {selectedCategory && (
              <button
                type="button"
                className="admin-btn admin-btn--primary admin-btn--sm"
                onClick={() => setProductModal({ mode: "new", productId: null })}
              >
                + Ürün Ekle
              </button>
            )}
          </div>

          {!selectedCategory ? (
            <p className={styles.empty}>Ürün eklemek için önce bir kategori seçin.</p>
          ) : selectedCategory.products.length === 0 ? (
            <p className={styles.empty}>Bu kategoride henüz ürün yok.</p>
          ) : (
            <DndContext
              id="products-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleProductDragEnd}
            >
              <SortableContext
                items={selectedCategory.products.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedCategory.products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={() => setProductModal({ mode: "edit", productId: product.id })}
                    onDelete={() =>
                      setConfirmTarget({
                        type: "product",
                        id: product.id,
                        label: `"${product.translations.tr?.name || product.slug}" silinecek.`,
                      })
                    }
                    onToggleActive={() => {
                      setCategories((prev) =>
                        prev.map((c) =>
                          c.id !== selectedCategory.id
                            ? c
                            : {
                                ...c,
                                products: c.products.map((p) =>
                                  p.id === product.id ? { ...p, active: !p.active } : p
                                ),
                              }
                        )
                      );
                      updateProduct(product.id, { active: !product.active }).then(refresh);
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {categoryModal && (
        <CategoryFormModal
          category={categoryModal === "new" ? null : categoryModal}
          onSave={handleSaveCategory}
          onClose={() => setCategoryModal(null)}
        />
      )}

      {productModal && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          defaultCategoryId={selectedCategoryId}
          onSave={handleSaveProduct}
          onImageChanged={refresh}
          onClose={() => setProductModal(null)}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          title="Emin misiniz?"
          message={confirmTarget.label}
          pending={confirmPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
