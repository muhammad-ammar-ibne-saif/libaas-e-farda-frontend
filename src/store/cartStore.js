import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items:    [],
      isOpen:   false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      total: () => get().items.reduce((s, i) => s + (i.product.salePrice || i.product.price) * i.quantity, 0),

      addItem: (product, size, color) => {
        const key = `${product._id || product.id}-${size}-${color?.name || 'default'}`;
        set(s => {
          const existing = s.items.find(i => i.key === key);
          if (existing) {
            return { items: s.items.map(i => i.key === key ? { ...i, quantity: i.quantity + 1 } : i), isOpen: true };
          }
          return { items: [...s.items, { key, product, size, color, quantity: 1 }], isOpen: true };
        });
      },

      removeItem: (key) => set(s => ({ items: s.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty < 1) { get().removeItem(key); return; }
        set(s => ({ items: s.items.map(i => i.key === key ? { ...i, quantity: qty } : i) }));
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'lef-cart', partialize: (s) => ({ items: s.items }) }
  )
);

// Wishlist Store
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const id = product._id || product.id;
        const exists = get().items.find(i => (i._id || i.id) === id);
        set(s => ({
          items: exists ? s.items.filter(i => (i._id || i.id) !== id) : [...s.items, product],
        }));
      },

      isWishlisted: (id) => !!get().items.find(i => (i._id || i.id) === id),
      count: () => get().items.length,
    }),
    { name: 'lef-wishlist', partialize: (s) => ({ items: s.items }) }
  )
);