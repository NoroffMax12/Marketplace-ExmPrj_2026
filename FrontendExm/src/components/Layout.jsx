/* Shared layout wrapper for all protected pages. Uses React Router's Outlet to render the current page.
-  NTS: (useLocation = hook that gives info about url-route) */

import {Outlet, useLocation} from 'react-router-dom'
import Sidebar from './Sidebar'

// Page titles and subtitles per route
const PAGE_META = {
  '/': {title: 'Dashboard', sub: 'Overview & quick access' },
  '/products':{title: 'Products', sub: 'Manage your product catalog' },
  '/categories':{title: 'Categories', sub: 'Manage product categories' },
  '/brands': {title: 'Brands', sub: 'Manage brands' },
  '/orders': {title: 'Orders', sub: 'Track and manage orders' },
  '/users': {title: 'Users', sub: 'Manage registered users' },
  '/membership':{title: 'Membership', sub: 'Configure membership tiers' },
  '/search': {title: 'Search', sub: 'Search across all products' },
}


export default function Layout() { //Gets url-path by deconstructing; with fallback if url-path dont exist "{title: 'EPAdmin', sub: ''}"
  const {pathname} = useLocation()
  const meta = PAGE_META[pathname] || {title: 'EPAdmin', sub: ''}

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-8 py-4 flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">{meta.title}</h1>
          {meta.sub && <p className="text-muted text-xs mt-0.5">{meta.sub}</p>}
        </header>


        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
