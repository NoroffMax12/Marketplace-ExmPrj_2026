// Handles user-related API calls.
// Admin can view users and update their details.
// Note: RoleId 1 = Admin, RoleId 2 = User

import api from './axiosInstance'

// GET /users -> returns all users excluding passwords
export const getUsers = () => api.get('/users')

// PUT /users/:id -> (firstname, lastname, email, RoleId)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
