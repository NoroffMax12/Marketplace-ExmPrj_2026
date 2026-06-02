/*Categories management page - Full CRUD*/

import {useState, useEffect} from 'react'
import Modal, {ModalField, ModalFooter} from '../components/Modal'
import {useToast} from '../context/ToastContext'
import  {getCategories, createCategory, updateCategory, deleteCategory} from '../api/categories.api'


export default function Categories() { //NTS: The Categories management component mirrors the exact architecture of the Brands component, using useToast and manages local states.
  const {addToast} = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected]  = useState(null)
  const [name, setName] = useState('')


  useEffect(() => {fetchCategories()}, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      setCategories(res.data?.data?.categories || [])
    } catch {addToast('Failed to load categories', 'error') }
    finally {setLoading(false)}
  }


  const openAdd  = () => {setSelected(null); setName(''); setModalOpen(true) }
  const openEdit = (cat) => {setSelected(cat); setName(cat.name || ''); setModalOpen(true) }


  const handleSave = async () => {setSaving(true)
    try {
      if (selected) {
        await updateCategory(selected.id, {name})
        addToast('Category updated')
      } else {
        await createCategory({name})
        addToast('Category created')
      }
      setModalOpen(false)
      fetchCategories()
    } catch { addToast('Save failed', 'error') }
    finally { setSaving(false) }
  }


  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      addToast('Category deleted')
      fetchCategories()
    } catch { addToast('Delete failed', 'error') }
  }


  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium flex items-center justify-between">
        <span>Current categories</span>
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
          ) : categories.length === 0 ? (
            <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">No categories found</td></tr>
          ) : categories.map((cat, i) => (
            <tr key={cat.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
              <td className="px-5 py-3 text-muted">{cat.id}</td>
              <td className="px-5 py-3 font-medium">{cat.name}</td>
              <td className="px-5 py-3 text-muted">{cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : '—'}</td>
              <td className="px-5 py-3">
                <div className="flex gap-1.5">
                  <button onClick={() => handleDelete(cat.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-danger hover:text-white text-danger flex items-center justify-center transition-colors">🗑</button>
                  <button onClick={() => openEdit(cat)}        className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 flex items-center justify-center transition-colors">✏️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit category' : 'Add category'} size="sm">
        {selected && (
          <ModalField label="Id">
            <input disabled value={selected.id} className="input bg-surface cursor-not-allowed" />
          </ModalField>
        )}
        <ModalField label="Name">
          <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Category name" />
        </ModalField>
        <ModalFooter onClose={() => setModalOpen(false)} onSave={handleSave} saveLabel={selected ? 'Save changes' : 'Add Category'} loading={saving} />
      </Modal>
    </div>
  )
}
