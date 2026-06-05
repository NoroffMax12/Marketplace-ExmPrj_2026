/* Main dashboard page shown after login. Displays key stats, quick action buttons and recent activity tables. */

import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import {getProducts} from '../api/products.api'
import {getOrders} from '../api/orders.api'
import {getUsers} from '../api/users.api'
import {getCategories} from '../api/categories.api'
import {Plus, ArrowRight} from 'lucide-react'

//Import from recharts lib in order to implement charts in dash
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {getBrands} from '../api/brands.api'
import {getMemberships} from '../api/membership.api'


export default function Dashboard() {// Initializes the Dashboard component and sets up the useNavigate hook from react-router.
  const navigate = useNavigate()
  const [stats, setStats] = useState({products: null, orders: null, users: null, categories: null})
  const [recent, setRecent] = useState({orders: [], users:[]})
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])
  const [memberships, setMemberships] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async() => {
    try {
      const [pRes, oRes, uRes, cRes, bRes, mRes] = await Promise.allSettled([// NTS: fetchAll function runs API-requests using "Promise.allSettled". This ensures that if one request fails, the others still load without crashing the dash.
        getProducts(), getOrders(), getUsers(), getCategories(), getBrands(), getMemberships(),
      ])

      const products = pRes.value?.data?.data?.products || []
      const orders = oRes.value?.data?.data?.orders || []
      const users = uRes.value?.data?.data?.users || []
      const categories = cRes.value?.data?.data?.categories || []
      const brands = bRes.value?.data?.data?.brands || []
      const memberships = mRes.value?.data?.data?.memberships || mRes.value?.data?.data || []


      setStats({
        products: products.length,
        orders: orders.filter(o => o.status?.toLowerCase() === 'in progress').length,
        users: users.length,
        categories: categories.length,
      })

      setBrands(brands)  
      setMemberships(memberships)

      // Build category chart data from products
      const categoryData = categories.map(cat => ({
        name: cat.name,
        value: products.filter(p => p.category === cat.name).length,
      }))
     
      setCategories(categoryData)
      setRecent({
        orders: [...orders].reverse().slice(0, 5),
        users: [...users].reverse().slice(0, 5),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }


    return (
    <div className="space-y-6 animate-slide-in">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div onClick={() => navigate('/products')} className="cursor-pointer">
            <StatCard title="Total Products" value={stats.products} icon="📦" />
        </div>
        <div onClick={() => navigate('/orders')} className="cursor-pointer">
            <StatCard title="Active Orders" value={stats.orders} icon="🛒" />
        </div>
        <div onClick={() => navigate('/users')} className="cursor-pointer">
            <StatCard title="Registered Users" value={stats.users} icon="👥" />
        </div>
        <div onClick={() => navigate('/categories')} className="cursor-pointer">
            <StatCard title="Categories" value={stats.categories} icon="🏷️" />
        </div>
        </div>

      {/* Quick action buttons */}
      <div className="flex gap-3">
        <button onClick={() => navigate('/products')} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Add Product
        </button>
        <button onClick={() => navigate('/orders')} className="btn-secondary flex items-center gap-2">
          View Orders <ArrowRight size={14} />
        </button>
        <button onClick={() => navigate('/users')} className="btn-secondary flex items-center gap-2">
          Manage Users <ArrowRight size={14} />
        </button>
      </div>
         
      {/* Recent activity tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Recent orders */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
              </div>
              {loading ? (
                <div className="px-5 py-8 text-center text-muted text-sm">Loading...</div>
              ) : recent.orders.length === 0 ? (
                <div className="px-5 py-8 text-center text-muted text-sm">No orders yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      {['Order', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.orders.map((o, i) => (
                      <tr key={o.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                        <td className="px-5 py-3 font-mono text-sm">{o.orderNumber || `#${o.id}`}</td>
                        <td className="px-5 py-3"><Badge label={o.status} /></td>
                        <td className="px-5 py-3 text-muted text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

        {/* Recent users */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-gray-900">Recent Users</h3>
              </div>
              {loading ? (
                <div className="px-5 py-8 text-center text-muted text-sm">Loading...</div>
              ) : recent.users.length === 0 ? (
                <div className="px-5 py-8 text-center text-muted text-sm">No users yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      {['Username', 'Email', 'Joined'].map(h => (
                        <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.users.map((u, i) => (
                      <tr key={u.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                        <td className="px-5 py-3 font-medium">{u.username}</td>
                        <td className="px-5 py-3 text-muted text-xs truncate max-w-[140px]">{u.email}</td>
                        <td className="px-5 py-3 text-muted text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

      {/* Stats charts section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Products by category */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-gray-900">Products by Category</h3>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

        {/* Brands overview */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-gray-900">Brands Overview</h3>
              </div>
              <div className="p-4">
                {brands.length === 0 ? (
                  <p className="text-muted text-sm text-center py-6">No brands found</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map(b => (
                      <div key={b.id} className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{b.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          {/* Orders summary */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-gray-900">Orders Summary</h3>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={recent.orders.map(o => ({ name: o.orderNumber || `#${o.id}`, total: o.totalPrice || 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="total" fill="#16a34a" radius={[4,4,0,0]} name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

        {/* Membership overview */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-gray-900">Membership Tiers</h3>
              </div>
              <div className="p-4">
                {memberships.length === 0 ? (
                  <p className="text-muted text-sm text-center py-6">No memberships found</p>
                ) : (
                  <div className="space-y-3">
                    {memberships.map(m => (
                      <div key={m.id} className="flex items-center justify-between px-3 py-2.5 bg-surface rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{m.name}</span>
                        <div className="flex items-center gap-4 text-xs text-muted">
                          <span>Min: {m.minQuantity ?? 0}</span>
                          <span>Max: {m.maxQuantity ?? '∞'}</span>
                          <span className="text-primary font-semibold">{m.discount}% off</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )
    }
