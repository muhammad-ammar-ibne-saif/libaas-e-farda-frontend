import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      customer: null,
      token:    null,

      isLoggedIn: () => !!(get().customer && get().token),

      login: async (email, password) => {
        const res  = await fetch(`${API}/customers/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Login failed');
        set({ customer: data.customer, token: data.token });
        return data;
      },

      register: async (name, email, phone, password) => {
        const res  = await fetch(`${API}/customers/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Registration failed');
        set({ customer: data.customer, token: data.token });
        return data;
      },

      logout: () => set({ customer: null, token: null }),

      updateProfile: async (updates) => {
        const { token } = get();
        if (!token) throw new Error('Not logged in');
        const res  = await fetch(`${API}/customers/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Update failed');
        set({ customer: data.customer });
        return data;
      },

      fetchOrders: async () => {
        const { token } = get();
        if (!token) return [];
        try {
          const res  = await fetch(`${API}/customers/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          return data.orders || [];
        } catch { return []; }
      },

      changePassword: async (currentPassword, newPassword) => {
        const { token } = get();
        if (!token) throw new Error('Not logged in');
        const res  = await fetch(`${API}/customers/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed');
        return data;
      },
    }),
    { name: 'lef-customer', partialize: (s) => ({ customer: s.customer, token: s.token }) }
  )
);