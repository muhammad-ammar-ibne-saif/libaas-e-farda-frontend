const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const get = async (url) => {
  const res = await fetch(`${API}${url}`);
  return res.json();
};

const post = async (url, body) => {
  const res = await fetch(`${API}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

// Settings
export const fetchSettings    = ()        => get('/settings');

// Products
export const fetchProducts    = (params)  => get(`/products${params ? '?' + params : ''}`);
export const fetchProduct     = (slug)    => get(`/products/${slug}`);

// Categories
export const fetchCategories  = (params)  => get(`/categories${params ? '?' + params : ''}`);

// Attributes
export const fetchAttributes  = ()        => get('/attributes');

// Blog
export const fetchBlogPosts   = (params)  => get(`/blog${params ? '?' + params : ''}`);
export const fetchBlogPost    = (slug)    => get(`/blog/${slug}`);

// Orders
export const createOrder      = (data)    => post('/orders', data);
export const trackOrder       = (number)  => get(`/orders/track/${number}`);

// Coupons
export const validateCoupon   = (code, subtotal) => post('/coupons/validate', { code, subtotal });

// Reviews
export const fetchReviews     = (productId) => get(`/reviews/${productId}`);
export const submitReview     = (data)      => post('/reviews', data);

// Back in stock
export const notifyBackInStock = (data)   => post('/back-in-stock', data);