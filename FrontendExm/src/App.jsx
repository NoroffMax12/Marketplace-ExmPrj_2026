/* Root component — defines all routes for the app. Protected routes are wrapped in ProtectedRoute. */


import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext'
import {ToastProvider} from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'


import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Brands from './pages/Brands'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Membership from './pages/Membership'
import Search from './pages/Search'


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />


            {/* Protected routes — share the sidebar Layout */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/search" element={<Search />} />
            </Route>


            {/* Catches — redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
