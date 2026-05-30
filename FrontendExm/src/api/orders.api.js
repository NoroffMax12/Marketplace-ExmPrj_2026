// Handles order-related API calls and allows admins to manage the order flow like viewing orders and update order status.

import api from './axiosInstance'

// GET /orders = Wrapper around order API to get all orders & returns orders with nested User and membership objects
export const getOrders = () => api.get('/orders')

// GET /orders/:id -> returns single order with OrderItems
export const getOrder = (id) => api.get(`/orders/${id}`)

// PATCH /orders/:id -> (When an admin changes the status in the app, I pass along either 'In Progress', 'Ordered', or 'Completed')
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}`, {status})
