const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';
const TOKEN_KEY = 'wartatekno_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export async function apiRequest(path, options = {}) {
  const headers = { Accept: 'application/json', ...(options.body instanceof FormData ? {} : options.body ? { 'Content-Type': 'application/json' } : {}), ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers };
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = payload.errors ? Object.values(payload.errors).flat().join(' ') : '';
    throw new Error(errors || payload.message || `Request gagal (${response.status})`);
  }
  return payload;
}
const unwrap = (p) => Array.isArray(p) ? p : (p?.data && Array.isArray(p.data) ? p.data : []);
const statusProduct = (v) => ({ active: 'Aktif', draft: 'Draf', archived: 'Arsip' }[v] || v || 'Aktif');
const statusComment = (v) => ({ pending: 'Menunggu', approved: 'Disetujui', flagged: 'Spam' }[v] || v);
const statusFeedback = (v) => ({ new: 'Belum Ditanggapi', read: 'Sedang Ditinjau Tim Teknis', resolved: 'Selesai' }[v] || v);
export function mapProduct(p) {
  if (!p) return p;
  return { ...p, id: String(p.slug || p.id), databaseId: p.id, category: p.category?.name || p.category || '', image: p.image_url || p.image || p.images?.[0]?.url || '', images: (p.images || []).map(x => x.url || x), rating: Number(p.rating_avg ?? p.rating ?? 0), reviewsCount: Number(p.reviews_count ?? p.reviewsCount ?? 0), status: statusProduct(p.status), specs: p.specs_json || p.specs || [] };
}
export function mapComment(c) {
  return { ...c, id: String(c.id), productId: String(c.product?.slug || c.product_id), userName: c.user_name || c.userName || 'Pengguna', userRole: c.is_staff ? 'Admin' : 'Member', comment: c.comment_text || c.comment || '', createdAt: c.created_at || c.createdAt, likes: Number(c.upvotes_count ?? c.likes ?? 0), likedByMe: Boolean(c.liked_by_me), status: statusComment(c.status), reply: c.replies?.[0] ? mapComment(c.replies[0]) : c.reply };
}
export function mapFeedback(f) {
  const parts = (f.message || '').split('\n\n');
  const category = ({ product_request: 'Permintaan Ulasan Produk Baru', bug_report: 'Laporan Bug & Sistem', feature_suggestion: 'Saran Fitur & UI', general: 'Umum' })[f.category] || f.category;
  return { ...f, id: String(f.id), userName: f.name || f.user_name || f.userName, category, title: parts[0]?.length < 120 ? parts[0] : 'Masukan pengguna', message: parts.length > 1 ? parts.slice(1).join('\n\n') : f.message, timeAgo: f.created_at || f.createdAt, status: statusFeedback(f.status), tags: f.tags || [] };
}
export async function getProducts(params = {}) { const q = new URLSearchParams(params).toString(); const p = await apiRequest(`/products${q ? `?${q}` : ''}`); return unwrap(p).map(mapProduct); }
export async function getProduct(id) { const p = await apiRequest(`/products/${encodeURIComponent(id)}`); return mapProduct(p.data || p); }
export async function login(email, password) { const p = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); setToken(p.token); return p.user; }
export async function register(name, email, password) { const p = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, password_confirmation: password }) }); setToken(p.token); return p.user; }
export async function logout() { try { await apiRequest('/auth/logout', { method: 'POST' }); } finally { setToken(null); } }
export async function getMe() { const p = await apiRequest('/auth/me'); return p.user; }
export async function getSaved() {
  const first = await apiRequest('/me/saved?page=1');
  const rows = [...unwrap(first)];
  const lastPage = Number(first.last_page || 1);
  for (let page = 2; page <= lastPage; page += 1) {
    const next = await apiRequest(`/me/saved?page=${page}`);
    rows.push(...unwrap(next));
  }
  return rows.map(x => mapProduct(x.product || x));
}
export const saveProduct = id => apiRequest(`/me/saved/${encodeURIComponent(id)}`, { method: 'POST', body: JSON.stringify({}) });
export const unsaveProduct = id => apiRequest(`/me/saved/${encodeURIComponent(id)}`, { method: 'DELETE' });
export async function getComments(id) { const p = await apiRequest(`/products/${encodeURIComponent(id)}/comments?per_page=50`); return unwrap(p).map(mapComment); }
export const postComment = (id, comment, rating) => apiRequest(`/products/${encodeURIComponent(id)}/comments`, { method: 'POST', body: JSON.stringify({ comment_text: comment, rating }) });
export const likeComment = id => apiRequest(`/comments/${id}/like`, { method: 'POST' });
export const postFeedback = data => apiRequest('/feedback', { method: 'POST', body: JSON.stringify({ name: data.userName, email: data.email, category: ({ 'Permintaan Ulasan Produk Baru': 'product_request', 'Laporan Bug & Sistem': 'bug_report', 'Saran Fitur & UI': 'feature_suggestion' })[data.category], message: `${data.title}\n\n${data.message}` }) });
export async function getAdminProducts() { const p = await apiRequest('/admin/products?per_page=100'); return unwrap(p).map(mapProduct); }
export async function getCategories() { const p = await apiRequest('/categories'); return unwrap(p); }
export async function createProduct(p) {
  const cats = await getCategories(); const category = cats.find(c => c.name === p.category || c.slug === p.category);
  if (!category) throw new Error(`Kategori ${p.category} belum tersedia di database.`);
  const body = { category_id: category.id, title: p.title, brand: p.brand, sku: p.sku || null, description: p.description || '', image_url: p.image || null, price: Number(p.price), specs_json: p.specs || [], status: p.status === 'Draf' ? 'draft' : 'active' };
  const result = await apiRequest('/products', { method: 'POST', body: JSON.stringify(body) }); return mapProduct(result.data);
}
export async function updateProduct(p) {
  const cats = await getCategories(); const category = cats.find(c => c.name === p.category || c.slug === p.category);
  if (!category) throw new Error(`Kategori ${p.category} belum tersedia di database.`);
  const body = { category_id: category.id, title: p.title, brand: p.brand, sku: p.sku || null, description: p.description || '', image_url: p.image || null, price: Number(p.price), specs_json: p.specs || [], status: p.status === 'Draf' ? 'draft' : 'active' };
  const result = await apiRequest(`/products/${encodeURIComponent(p.databaseId)}`, { method: 'PUT', body: JSON.stringify(body) }); return mapProduct(result.data);
}
export const deleteProduct = id => apiRequest(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
export async function getAdminComments(params = {}) { const q = new URLSearchParams(params).toString(); const p = await apiRequest(`/admin/comments?per_page=100${q ? `&${q}` : ''}`); return { summary: p.summary || {}, comments: (p.comments?.data || []).map(mapComment) }; }
export const updateCommentStatus = (id, status) => apiRequest(`/admin/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ status: ({ Menunggu: 'pending', Disetujui: 'approved', Spam: 'flagged' })[status] || status }) });
export const removeComment = id => apiRequest(`/admin/comments/${id}`, { method: 'DELETE' });
export async function getAdminFeedbacks(params = {}) { const normalized = { ...params }; if (normalized.category) normalized.category = ({ 'Permintaan Ulasan Produk Baru': 'product_request', 'Laporan Bug & Sistem': 'bug_report', 'Saran Fitur & UI': 'feature_suggestion' })[normalized.category] || normalized.category; if (normalized.status) normalized.status = ({ 'Belum Ditanggapi': 'new', 'Sedang Ditinjau Tim Teknis': 'read', 'Diimplementasikan': 'resolved', 'Selesai': 'resolved' })[normalized.status] || normalized.status; const q = new URLSearchParams(normalized).toString(); const p = await apiRequest(`/admin/feedbacks?per_page=100${q ? `&${q}` : ''}`); return { summary: p.summary || {}, feedbacks: (p.feedbacks?.data || []).map(mapFeedback) }; }
export const updateFeedbackStatus = (id, status) => apiRequest(`/admin/feedbacks/${id}`, { method: 'PATCH', body: JSON.stringify({ status: ({ 'Belum Ditanggapi': 'new', 'Sedang Ditinjau Tim Teknis': 'read', 'Diimplementasikan': 'resolved', 'Selesai': 'resolved' })[status] || status }) });
export const removeFeedback = id => apiRequest(`/admin/feedbacks/${id}`, { method: 'DELETE' });
