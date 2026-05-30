/*Main navigation sidebar for all protected pages. Contains logo, nav, links and user info with logout btn.*/

import { NavLink, useNavigate } from 'react-router-dom'
import {useAuth} from '../context/AuthContext'// react-hook return auth data from "AuthContext"
import {
  LayoutDashboard, Package, Tag, Layers,
  Star, Users, ShoppingCart, Search, LogOut,
} from 'lucide-react'


// Navigation items — path must match App.jsx routes
const NAV = [
  {label: 'Dashboard', path: '/', icon: LayoutDashboard},
  {label: 'Products', path: '/products', icon: Package},
  {label: 'Categories', path: '/categories', icon: Layers},
  {label: 'Brands', path: '/brands', icon: Tag},
  {label: 'Orders', path: '/orders', icon: ShoppingCart},
  {label: 'Users', path: '/users', icon: Users},
  {label: 'Membership', path: '/membership', icon: Star},
  {label: 'Search', path: '/search', icon: Search},
]

export default function Sidebar() {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">EPAdmin</p>
            <p className="text-white/30 text-[10px]">Management Panel</p>
          </div>
        </div>
      </div>


      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               transition-all duration-150
               ${isActive
                 ? 'bg-primary/15 text-primary'
                 : 'text-white/45 hover:text-white/80 hover:bg-white/5'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 w-0.5 h-5 rounded-r bg-primary" />
                )}
                <Icon size={16} className="flex-shrink-0" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>


      {/* User info and logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-xs font-bold">
              {(user?.username || 'A')[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium truncate">{user?.username || 'Admin'}</p>
            <p className="text-white/30 text-[10px] truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-white/40 hover:text-white/70 hover:bg-white/5
                     text-sm transition-all duration-150"
        >
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
