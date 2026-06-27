"use client";
import { useEffect } from "react";
import { useCartStore, useWishlistStore } from "../../store/cartStore";
import { useCustomerStore } from "../../store/customerStore";

export default function StoreHydration() {
  useEffect(() => {
    // Rehydrate persisted stores from localStorage
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useCustomerStore.persist.rehydrate();
  }, []);
  return null;
}
