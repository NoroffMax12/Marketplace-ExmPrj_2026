// Handles authentication API calls.
// Only used for login — registration is not part of the admin panel.

import api from './axiosInstance'

// POST /auth/login -> (email, password)
export const login = (email, password) =>
  api.post('/auth/login', { email, password })
