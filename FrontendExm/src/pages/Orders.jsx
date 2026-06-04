/* Orders management page.
- Admin can view orders and update order status. */

import {useState, useEffect} from 'react'
import Modal, { ModalField, ModalFooter } from '../components/Modal'
import Badge from '../components/Badge'
import {useToast} from '../context/ToastContext'
import {getOrders, updateOrderStatus } from '../api/orders.api'
// import for line chart
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'


// Status options matching DB ENUM
const STATUSES = ['All', 'In Progress', 'Ordered', 'Completed']


export default function Orders() {
  const {addToast} = useToast()
  const [orders, setOrders] = useState([])
  const [filtered,setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')


  useEffect(() => {fetchOrders() }, [])

  // Re-filter when orders or status filter changes
  useEffect(() => {
    if (statusFilter === 'All') setFiltered(orders)
    else setFiltered(orders.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase()))
  }, [statusFilter, orders])


  const fetchOrders = async () => { setLoading(true)
    try {
      const res = await getOrders()
      setOrders(res.data?.data?.orders || [])
    } catch { addToast('Failed to load orders', 'error') }
    finally { setLoading(false) }
  }


  const openEdit = (order) => {
    setSelected(order)
    setNewStatus(order.status || 'Ordered')
    setModalOpen(true)
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      await updateOrderStatus(selected.id, newStatus)
      addToast('Order status updated')
      setModalOpen(false)
      fetchOrders()
    } catch { addToast('Update failed', 'error') }
    finally { setSaving(false) }
  }


  return (
    <div className="space-y-4">
      {/* Status filter bar */}
      <div className="bg-card rounded-xl shadow-card px-5 py-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Filter by status:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select w-44">
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-xs text-muted">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
      </div>


      {/* Orders table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium">Current orders</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                {['Order #', 'User', 'Membership', 'Total', 'Status', 'Date', 'Options'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">No orders found</td></tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>


                  {/* orderNumber from DB, fallback to id */}
                  <td className="px-5 py-3 font-mono font-medium">{order.orderNumber || `#${order.id}`}</td>


                  {/* User is nested object: order.User.username */}
                  <td className="px-5 py-3">
                    <div>{order.User?.username || '—'}</div>
                    <div className="text-xs text-muted">{order.User?.email}</div>
                  </td>


                  {/* Membership is nested object: order.Membership.name */}
                  <td className="px-5 py-3"><Badge label={order.Membership?.name || 'Bronze'} /></td>
                  {/* DB column is totalPrice (FLOAT) */}
                  <td className="px-5 py-3 font-medium">{order.totalPrice != null ? `$${Number(order.totalPrice).toFixed(2)}` : '—'}</td>
                  <td className="px-5 py-3"><Badge label={order.status} /></td>
                  <td className="px-5 py-3 text-muted text-xs whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openEdit(order)} className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 flex items-center justify-center transition-colors">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Edit status modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit order status" size="sm">
        {selected && (
          <>
            <ModalField label="Order Number">
              <input disabled value={selected.orderNumber || `#${selected.id}`} className="input bg-surface cursor-not-allowed" />
            </ModalField>
            <ModalField label="Current Status">
              <input disabled value={selected.status} className="input bg-surface cursor-not-allowed" />
            </ModalField>
            {/* Values match ENUM in DB */}
            <ModalField label="New Status">
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="select">
                {['In Progress', 'Ordered', 'Completed'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </ModalField>
          </>
        )}
        <ModalFooter onClose={() => setModalOpen(false)} onSave={handleSave} saveLabel="Save changes" loading={saving} />
     </Modal>


      {/* Revenue line chart */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-gray-900">Revenue Overview</h3>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orders.map(o => ({
              name: o.orderNumber || `#${o.id}`,
              revenue: o.totalPrice || 0,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
