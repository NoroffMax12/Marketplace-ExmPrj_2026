/* Brands management page.
- Full CRUD - with identical structure to Categories.jsx. */

import {useState, useEffect} from 'react'
import Modal, {ModalField, ModalFooter} from '../components/Modal'
import {useToast} from '../context/ToastContext'
import {getBrands, createBrand, updateBrand, deleteBrand} from '../api/brands.api'


export default function Brands() {// Brands management components uses "useToast" & "useState"to manage 6 local states nd trigger popups.
  const { addToast } = useToast()
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [name, setName] = useState('')


  useEffect(() => {fetchBrands()}, [])


  const fetchBrands = async () => {
    setLoading(true)
    try {
      const res = await getBrands()
      setBrands(res.data?.data?.brands || [])
    } catch {addToast('Failed to load brands', 'error')}
    finally {setLoading(false)}
  }


  // These two functions control how the modal opens. openAdd resets selected to null and clears the name input for a fresh entry.
  const openAdd  = () => {setSelected(null); setName(''); setModalOpen(true)}
  const openEdit = (b) => {setSelected(b); setName(b.name || ''); setModalOpen(true)}


  const handleSave = async () => {// NTS: "handleSave" is an asynchronous function triggered when user clicks save. It sets setSaving(true) to initiate loading state in the UI.
    setSaving(true)
    try {
      if (selected) {
        await updateBrand(selected.id, {name})
        addToast('Brand updated')
      } else {
        await createBrand({ name })
        addToast('Brand created')
      }
      setModalOpen(false)
      fetchBrands()
    } catch { addToast('Save failed', 'error') }
    finally { setSaving(false) }
  }


  const handleDelete = async (id) => {
    if (!confirm('Delete this brand?')) return
    try {
      await deleteBrand(id)
      addToast('Brand deleted')
      fetchBrands()
    } catch { addToast('Delete failed', 'error') }
  }


  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium flex items-center justify-between">
        <span>Current brands</span>
        <button onClick={openAdd} className="btn-primary text-xs px-3 py-1.5">+ Add</button>
      </div>


      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface border-b border-border">
            {['Id', 'Name', 'Created At', 'Options'].map(h => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
          ) : brands.length === 0 ? (
            <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">No brands found</td></tr>
          ) : brands.map((b, i) => (
            <tr key={b.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
              <td className="px-5 py-3 text-muted">{b.id}</td>
              <td className="px-5 py-3 font-medium">{b.name}</td>
              <td className="px-5 py-3 text-muted">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</td>
              <td className="px-5 py-3">
                <div className="flex gap-1.5">
                  <button onClick={() => handleDelete(b.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-danger hover:text-white text-danger flex items-center justify-center transition-colors">🗑</button>
                  <button onClick={() => openEdit(b)}        className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 flex items-center justify-center transition-colors">✏️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit brand' : 'Add brand'} size="sm">
        {selected && (
          <ModalField label="Id">
            <input disabled value={selected.id} className="input bg-surface cursor-not-allowed" />
          </ModalField>
        )}
        <ModalField label="Name">
          <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Brand name" />
        </ModalField>
        <ModalFooter onClose={() => setModalOpen(false)} onSave={handleSave} saveLabel={selected ? 'Save changes' : 'Add Brand'} loading={saving} />
      </Modal>
    </div>
  )
}
