// Handles product-related API calls.
// Admin can view all products including soft-deleted ones.

import api from './axiosInstance'

// GET /products = Wrapper around prod API to get all Ptoducts -> returns products including deleted
export const getProducts = () => api.get('/products')

// GET /products/:id -> returns single product w brand & category
export const getProduct = (id) => api.get(`/products/${id}`)

// POST /products -> (name, description, unitprice, quantity, imgurl, BrandId, CategoryId)
export const createProduct = (data) => api.post('/products', data)

// PUT /products/:id -> update product fields
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)

// DELETE /products/:id -> soft delete (sets isdeleted: true)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

