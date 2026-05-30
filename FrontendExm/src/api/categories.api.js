// Handles all category-related API calls.
// Full CRUD — admin only.

import api from './axiosInstance'

// GET /categories =  Wrapper around categories API to get Categories
export const getCategories = () => api.get('/categories')

// POST /categories -> (name)
export const createCategory = (data) => api.post('/categories', data)

// PUT /categories/:id -> (name)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)

// DELETE /categories/:id
export const deleteCategory = (id) => api.delete(`/categories/${id}`)
