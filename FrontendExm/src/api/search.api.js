// Handles product search API calls.
// Search by name, category or brand.

import api from './axiosInstance'

// POST /search -> name, category, brand
export const searchProducts = (body) => api.post('/search', body)