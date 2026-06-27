const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const tok  = () => typeof window !== 'undefined' ? localStorage.getItem('lef_admin_token') : '';
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` });
const handle = async (res) => { const d = await res.json(); return d; };

// Auth
export const adminLogin          = (email, password) => fetch(`${API}/auth/login`, { method:'POST', headers:headers(), body:JSON.stringify({email,password}) }).then(handle);
export const adminMe             = () => fetch(`${API}/auth/me`, { headers:headers() }).then(handle);
export const adminChangePassword = (data) => fetch(`${API}/auth/change-password`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(handle);

// Dashboard
export const adminGetDashboard   = () => fetch(`${API}/admin/dashboard`, { headers:headers() }).then(handle);
export const adminGetAnalytics   = (period) => fetch(`${API}/admin/analytics?period=${period||'30'}`, { headers:headers() }).then(handle);

// Products
export const adminGetProducts    = (params='') => fetch(`${API}/admin/products?${params}`, { headers:headers() }).then(handle);
export const adminGetProduct     = (id)        => fetch(`${API}/admin/products/${id}`, { headers:headers() }).then(handle);
export const adminCreateProduct  = (data)      => fetch(`${API}/admin/products`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminUpdateProduct  = (id, data)  => fetch(`${API}/admin/products/${id}`, { method:'PUT', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminDeleteProduct  = (id)        => fetch(`${API}/admin/products/${id}`, { method:'DELETE', headers:headers() }).then(handle);
export const adminUpdateStock    = (id, stock) => fetch(`${API}/admin/products/${id}/stock`, { method:'PATCH', headers:headers(), body:JSON.stringify({stock}) }).then(handle);

// Orders
export const adminGetOrders      = (params='') => fetch(`${API}/admin/orders?${params}`, { headers:headers() }).then(handle);
export const adminGetOrder       = (id)        => fetch(`${API}/admin/orders/${id}`, { headers:headers() }).then(handle);
export const adminUpdateStatus   = (id, data)  => fetch(`${API}/admin/orders/${id}/status`, { method:'PATCH', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminConfirmWhatsApp= (id)        => fetch(`${API}/admin/orders/${id}/whatsapp-confirm`, { method:'PATCH', headers:headers() }).then(handle);

// Coupons
export const adminGetCoupons     = ()          => fetch(`${API}/admin/coupons`, { headers:headers() }).then(handle);
export const adminCreateCoupon   = (data)      => fetch(`${API}/admin/coupons`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminUpdateCoupon   = (id, data)  => fetch(`${API}/admin/coupons/${id}`, { method:'PUT', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminDeleteCoupon   = (id)        => fetch(`${API}/admin/coupons/${id}`, { method:'DELETE', headers:headers() }).then(handle);

// Settings
export const adminGetSettings    = ()          => fetch(`${API}/admin/settings`, { headers:headers() }).then(handle);
export const adminUpdateSettings = (data)      => fetch(`${API}/admin/settings`, { method:'PUT', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminUpdateTheme    = (theme)     => fetch(`${API}/admin/settings/theme`, { method:'PUT', headers:headers(), body:JSON.stringify({theme}) }).then(handle);
export const adminUpdateHero     = (slides)    => fetch(`${API}/admin/settings/hero`, { method:'PUT', headers:headers(), body:JSON.stringify({slides}) }).then(handle);

// Categories
export const adminGetCategories   = ()         => fetch(`${API}/admin/categories`, { headers:headers() }).then(handle);
export const adminCreateCategory  = (data)     => fetch(`${API}/admin/categories`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminUpdateCategory  = (id, data) => fetch(`${API}/admin/categories/${id}`, { method:'PUT', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminDeleteCategory  = (id)       => fetch(`${API}/admin/categories/${id}`, { method:'DELETE', headers:headers() }).then(handle);

// Attributes
export const adminGetAttributes   = ()         => fetch(`${API}/admin/attributes`, { headers:headers() }).then(handle);
export const adminCreateAttribute = (data)     => fetch(`${API}/admin/attributes`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminUpdateAttribute = (id, data) => fetch(`${API}/admin/attributes/${id}`, { method:'PUT', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminDeleteAttribute = (id)       => fetch(`${API}/admin/attributes/${id}`, { method:'DELETE', headers:headers() }).then(handle);

// Reviews
export const adminGetReviews    = (params='')  => fetch(`${API}/admin/reviews?${params}`, { headers:headers() }).then(handle);
export const adminApproveReview = (id)         => fetch(`${API}/admin/reviews/${id}/approve`, { method:'PATCH', headers:headers() }).then(handle);
export const adminReplyReview   = (id, reply)  => fetch(`${API}/admin/reviews/${id}/reply`, { method:'PATCH', headers:headers(), body:JSON.stringify({reply}) }).then(handle);
export const adminDeleteReview  = (id)         => fetch(`${API}/admin/reviews/${id}`, { method:'DELETE', headers:headers() }).then(handle);
export const adminPublishTestimonial = (id)    => fetch(`${API}/admin/reviews/${id}/publish-testimonial`, { method:'POST', headers:headers() }).then(handle);

// Customers
export const adminGetCustomers   = (params='') => fetch(`${API}/admin/customers?${params}`, { headers:headers() }).then(handle);
export const adminGetCustomer    = (id)        => fetch(`${API}/admin/customers/${id}`, { headers:headers() }).then(handle);
export const adminUpdateCustomer = (id, data)  => fetch(`${API}/admin/customers/${id}`, { method:'PATCH', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminDeleteCustomer = (id)        => fetch(`${API}/admin/customers/${id}`, { method:'DELETE', headers:headers() }).then(handle);

// Blog
export const adminGetBlogPosts   = (params='') => fetch(`${API}/admin/blog?${params}`, { headers:headers() }).then(handle);
export const adminGetBlogPost    = (id)        => fetch(`${API}/admin/blog/${id}`, { headers:headers() }).then(handle);
export const adminCreateBlogPost = (data)      => fetch(`${API}/admin/blog`, { method:'POST', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminUpdateBlogPost = (id, data)  => fetch(`${API}/admin/blog/${id}`, { method:'PUT', headers:headers(), body:JSON.stringify(data) }).then(handle);
export const adminDeleteBlogPost = (id)        => fetch(`${API}/admin/blog/${id}`, { method:'DELETE', headers:headers() }).then(handle);