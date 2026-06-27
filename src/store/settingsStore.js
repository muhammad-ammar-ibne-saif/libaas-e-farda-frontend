import { create } from 'zustand';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useSettingsStore = create((set, get) => ({
  settings: null,
  loading:  true,
  error:    null,

  fetch: async () => {
    if (get().settings) return; // cached
    try {
      set({ loading: true });
      const res  = await window.fetch(`${API}/settings`);
      const data = await res.json();
      if (data.success) set({ settings: data.settings, loading: false });
      else set({ error: 'Failed to load settings', loading: false });
    } catch {
      set({ error: 'Network error', loading: false });
    }
  },

  refetch: async () => {
    try {
      const res  = await window.fetch(`${API}/settings`);
      const data = await res.json();
      if (data.success) set({ settings: data.settings });
    } catch {}
  },

  // ── Typed getters ──────────────────────────────────────
  getAnnouncement:  () => get().settings?.announcement,
  getHeroSlides:    () => (get().settings?.heroSlides || []).filter(s => s.isActive).sort((a,b) => a.order - b.order),
  getPaymentMethods:() => (get().settings?.paymentMethods || []).filter(m => m.isActive),
  getTestimonials:  () => (get().settings?.testimonials || []).filter(t => t.isActive),
  getTrustBadges:   () => (get().settings?.trustBadges  || []).filter(b => b.isActive).sort((a,b) => a.order - b.order),
  getBrand:         () => get().settings?.brand    || {},
  getShipping:      () => get().settings?.shipping || {},
  getInstagram:     () => get().settings?.instagramSection,
  getTheme:         () => get().settings?.theme    || {},
  getNavLinks:      () => (get().settings?.navLinks || []).filter(l => l.isActive !== false).sort((a,b) => a.order - b.order),
  getFooterColumns: () => get().settings?.footerColumns || [],
  getHomeSections:  () => (get().settings?.homeSections || []).sort((a,b) => a.order - b.order),
  getSearchTags:    () => get().settings?.searchTags || [],
  getFaqs:          () => get().settings?.faqs || [],
  getAbout:         () => get().settings?.about || {},
  getSizeGuide:     () => get().settings?.sizeGuide || {},
  getCareers:       () => get().settings?.careers || {},
  getPress:         () => get().settings?.press || {},
  getSeo:           () => get().settings?.seo || {},
}));