/* Membership tiers management page.
-Full CRUD - add, edit and delete membership tiers. */

import {useState, useEffect} from 'react'
import Modal, {ModalField, ModalFooter} from '../components/Modal'
import {useToast} from '../context/ToastContext'
import {getMemberships, createMembership, updateMembership, deleteMembership} from '../api/membership.api'


// Field names as iun DB
const EMPTY_FORM = {name: '', minQuantity: '', maxQuantity: '', discount: '' }

export default function Membership() {
  const {addToast} = useToast()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)


  useEffect(() => { fetchMemberships() }, [])

  const fetchMemberships = async () => {
    setLoading(true)
    try {
      const res = await getMemberships()
      setMemberships(res.data?.data?.memberships || res.data?.data || [])
    } catch { addToast('Failed to load memberships', 'error') }
    finally { setLoading(false) }
  }

  const openAdd  = () => { setSelected(null); setForm(EMPTY_FORM); setModalOpen(true) }// NTS: openAdd function prepare UI for creating new entry. It resets selected to null, and resets form state using a predefined EMPTY_FORM constant.


  const openEdit = (m) => { setSelected(m)
    setForm({
      name: m.name || '', minQuantity: m.minQuantity ?? '',
      maxQuantity: m.maxQuantity ?? '', discount: m.discount ?? '',
    })
    setModalOpen(true)
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        minQuantity: form.minQuantity !== '' ? Number(form.minQuantity) : null,
        maxQuantity: form.maxQuantity !== '' ? Number(form.maxQuantity) : null,
        discount:    form.discount    !== '' ? Number(form.discount) : 0,
      }
      if (selected) {
        await updateMembership(selected.id, payload)
        addToast('Membership updated')
      } else {
        await createMembership(payload)
        addToast('Membership created')
      }
      setModalOpen(false)
      fetchMemberships()
    } catch { addToast('Save failed', 'error') }
    finally { setSaving(false) }
  }


  const handleDelete = async (id) => {
    if (!confirm('Delete this membership tier?')) return
    try {
      await deleteMembership(id)
      addToast('Membership deleted')
      fetchMemberships()
    } catch { addToast('Delete failed', 'error') }
  }


  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium flex items-center justify-between">
        <span>Membership tiers</span>
        <button onClick={openAdd} className="btn-primary text-xs px-3 py-1.5">+ Add</button>
      </div>


      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface border-b border-border">
            {['Id', 'Name', 'Min Quantity', 'Max Quantity', 'Discount %', 'Options'].map(h => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
          ) : memberships.length === 0 ? (
            <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No membership tiers found</td></tr>
          ) : memberships.map((m, i) => (
            <tr key={m.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
              <td className="px-5 py-3 text-muted">{m.id}</td>
              <td className="px-5 py-3 font-medium">{m.name}</td>
              <td className="px-5 py-3">{m.minQuantity ?? '—'}</td>
              <td className="px-5 py-3">{m.maxQuantity ?? '∞'}</td>
              <td className="px-5 py-3">{m.discount ?? 0}%</td>
              <td className="px-5 py-3">
                <div className="flex gap-1.5">
                  <button onClick={() => handleDelete(m.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-danger hover:text-white text-danger flex items-center justify-center transition-colors">🗑</button>
                  <button onClick={() => openEdit(m)}        className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 flex items-center justify-center transition-colors">✏️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit membership tier' : 'Add membership tier'} size="sm">
        <ModalField label="Name">
          <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" placeholder="e.g. Gold" />
        </ModalField>
        <ModalField label="Min Quantity" helper="Minimum number of orders to reach this tier">
          <input type="number" min="0" value={form.minQuantity} onChange={e => setForm(f => ({...f, minQuantity: e.target.value}))} className="input" placeholder="0" />
        </ModalField>
        <ModalField label="Max Quantity" helper="Leave blank for no upper limit">
          <input type="number" min="0" value={form.maxQuantity} onChange={e => setForm(f => ({...f, maxQuantity: e.target.value}))} className="input" placeholder="Unlimited" />
        </ModalField>
        <ModalField label="Discount %" helper="Percentage discount applied at checkout">
          <input type="number" min="0" max="100" step="0.1" value={form.discount} onChange={e => setForm(f => ({...f, discount: e.target.value}))} className="input" placeholder="0" />
        </ModalField>
        <ModalFooter onClose={() => setModalOpen(false)} onSave={handleSave} saveLabel={selected ? 'Save changes' : 'Add Membership'} loading={saving} />
      </Modal>
    </div>
  )
}
