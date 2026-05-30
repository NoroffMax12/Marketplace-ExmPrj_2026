// Handles all brand-related API calls.
// Full CRUD — admin only.

import api from './axiosInstance'

// GET /brands =  Wrapper around API-call to get list of brands
export const getBrands = () => api.get('/brands')

// POST /brands -> (name)
export const createBrand = (data) => api.post('/brands', data)

// PUT /brands/:id -> (name)
export const updateBrand = (id, data) => api.put(`/brands/${id}`, data)

// DELETE /brands/:id
export const deleteBrand = (id) => api.delete(`/brands/${id}`)
