// Redirects to /login if user is not authenticated or not an admin.

import {Navigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'// react-hook return auth data from "AuthContext"


export default function ProtectedRoute({children}) {
  const { token, isAdmin, loading } = useAuth()

  // Wait for localStorage rehydration before checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="text-muted text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  // Redirect to login
  if (!token || !isAdmin) return <Navigate to="/login" replace />


  return children
}
