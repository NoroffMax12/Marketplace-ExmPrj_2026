// Handles membership tier API calls.
// Full CRUD — admin only.

import api from './axiosInstance'

// GET /membership = Wrapper around members API to get Membership
export const getMemberships = () => api.get('/membership')

// POST /membership -> (name, minQuantity, maxQuantity, discount)
export const createMembership = (data) => api.post('/membership', data)

// PUT /membership/:id
export const updateMembership = (id, data) => api.put(`/membership/${id}`, data)

// DELETE /membership/:id
export const deleteMembership = (id) => api.delete(`/membership/${id}`)
