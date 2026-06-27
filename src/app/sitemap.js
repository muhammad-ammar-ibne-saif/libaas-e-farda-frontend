const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://libaas-e-farda.com';

export default async function sitemap() {
  const staticPages = [
    { url: BASE, changeFrequency:'weekly', priority:1 },
    { url:`${BASE}/shop`, changeFrequency:'daily', priority:0.9 },
    { url:`${BASE}/about`, changeFrequency:'monthly', priority:0.7 },
    { url:`${BASE}/blog`, changeFrequency:'weekly', priority:0.8 },
    { url:`${BASE}/faqs`, changeFrequency:'monthly', priority:0.6 },
    { url:`${BASE}/contact`, changeFrequency:'monthly', priority:0.6 },
    { url:`${BASE}/size-guide`, changeFrequency:'monthly', priority:0.5 },
    { url:`${BASE}/shipping`, changeFrequency:'monthly', priority:0.5 },
    { url:`${BASE}/returns`, changeFrequency:'monthly', priority:0.5 },
    { url:`${BASE}/careers`, changeFrequency:'weekly', priority:0.5 },
    { url:`${BASE}/press`, changeFrequency:'monthly', priority:0.4 },
  ];

  // Fetch products for dynamic routes
  let productPages = [];
  let blogPages    = [];
  try {
    const [products, posts] = await Promise.all([
      fetch(`${API}/products?limit=200`).then(r => r.json()),
      fetch(`${API}/blog?limit=100`).then(r => r.json()),
    ]);
    productPages = (products.products || []).map(p => ({
      url: `${BASE}/shop/${p.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: p.updatedAt,
    }));
    blogPages = (posts.posts || []).map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: p.updatedAt,
    }));
  } catch {}

  return [...staticPages, ...productPages, ...blogPages];
}