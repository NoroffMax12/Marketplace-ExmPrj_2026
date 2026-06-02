/* Products management page. Supports search/filter, add, edit, soft delete toggle. */

import {useState, useEffect} from 'react'
import Modal, {ModalField, ModalFooter} from '../components/Modal'
import {useToast} from '../context/ToastContext'
import {getProducts, createProduct, updateProduct, deleteProduct} from '../api/products.api'
import {getCategories} from '../api/categories.api'
import {getBrands} from '../api/brands.api'
import {searchProducts} from '../api/search.api'

const EMPTY_FORM = {
  name: '', description: '', unitprice: '', quantity: '',
  imgurl: '', BrandId: '', CategoryId: '', isdeleted: false,
}

// Products component manages product administration. Handles data fetching for products, categories, and brands (used for dropdowns)
export default function Products() {
  const {addToast} = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)


  useEffect(() => {fetchAll()}, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, cRes, bRes] = await Promise.all([
        getProducts(), getCategories(), getBrands(),
      ])
      setProducts(pRes.data?.data?.products || [])
      setCategories(cRes.data?.data?.categories || [])
      setBrands(bRes.data?.data?.brands || [])
    } catch {addToast('Failed to load products', 'error') }
    finally {setLoading(false) }
  }


  const handleSearch = async () => {
    if (!filterName && !filterCat && !filterBrand) {fetchAll(); return }
    try {
      const body = filterName  ? { name: filterName }
                 : filterCat   ? { category: filterCat }
                 : { brand: filterBrand }
      const res = await searchProducts(body)
      setProducts(res.data?.data?.products || [])
    } catch { addToast('Search failed', 'error') }
  }

  const handleClear = () => {
    setFilterName(''); setFilterCat(''); setFilterBrand('')
    fetchAll()
  }

  const openAdd = () => {
    setSelected(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }


  const openEdit = (product) => {
    setSelected(product)
    setForm({
      name: product.name || '',
      description: product.description || '',
      unitprice: product.unitprice || '',
      quantity: product.quantity || '',
      imgurl: product.imgurl || '',
      BrandId: product.BrandId || '',
      CategoryId: product.CategoryId || '',
      isdeleted: !!product.isdeleted,
    })
    setModalOpen(true)
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      if (selected) {
        await updateProduct(selected.id, form)
        addToast('Product updated')
      } else {
        await createProduct(form)
        addToast('Product created')
      }
      setModalOpen(false)
      fetchAll()
    } catch { addToast('Save failed', 'error') }
    finally { setSaving(false) }
  }


  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      addToast('Product deleted')
      fetchAll()
    } catch { addToast('Delete failed', 'error') }
  }


  const handleToggleDeleted = async (product) => {
    try {
      await updateProduct(product.id, { isdeleted: !product.isdeleted })
      fetchAll()
    } catch { addToast('Toggle failed', 'error') }
  }


  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-card rounded-xl shadow-card p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Name</label>
          <input placeholder="Product name" value={filterName} onChange={e => setFilterName(e.target.value)} className="input w-48" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Category</label>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="select w-40">
            <option value="">None</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Brand</label>
          <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} className="select w-40">
            <option value="">None</option>
            {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
        </div>
        <button onClick={handleSearch} className="btn-primary">🔍 Search</button>
        <button onClick={handleClear}  className="btn-secondary">↺ Clear</button>
        <button onClick={openAdd}      className="btn-primary ml-auto">+ Add</button>
      </div>


      {/* Products table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium">Current products</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-border">
                {['Id','Name','Description','Qty','Price','Brand','Category','Image','isDeleted','Date Added','Options'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={11} className="px-5 py-10 text-center text-muted">No products found</td></tr>
              ) : products.map((p, i) => (
                <tr key={p.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                  <td className="px-3 py-2.5 text-muted">{p.id}</td>
                  <td className="px-3 py-2.5 font-medium max-w-[140px] truncate">{p.name}</td>
                  <td className="px-3 py-2.5 max-w-[180px] truncate text-muted">{p.description}</td>
                  <td className="px-3 py-2.5">{p.quantity}</td>
                  <td className="px-3 py-2.5 font-medium">${p.unitprice}</td>
                  <td className="px-3 py-2.5">{p.brand}</td>
                  <td className="px-3 py-2.5">{p.category}</td>
                  <td className="px-3 py-2.5">
                    {p.imgurl
                      ? <img src={p.imgurl} alt="" className="w-8 h-8 object-contain rounded" onError={e => { e.target.style.display='none' }} />
                      : <span className="text-muted">—</span>
                    }
                  </td>
                  <td className="px-3 py-2.5">
                    <Toggle checked={!!p.isdeleted} onChange={() => handleToggleDeleted(p)} />
                  </td>
                  {/* Backend returns date_added, not createdAt */}
                  <td className="px-3 py-2.5 text-muted whitespace-nowrap">
                    {p.date_added ? new Date(p.date_added).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleDelete(p.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-danger hover:text-white text-danger flex items-center justify-center transition-colors">🗑</button>
                      <button onClick={() => openEdit(p)}        className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 flex items-center justify-center transition-colors">✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selected ? 'Edit product details' : 'Add new product'}>
        {selected && (
          <ModalField label="Id">
            <input disabled value={selected.id} className="input bg-surface cursor-not-allowed" />
          </ModalField>
        )}
        <ModalField label="Name">
          <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" />
        </ModalField>
        <ModalField label="Brand">
          <select value={form.BrandId} onChange={e => setForm(f => ({...f, BrandId: e.target.value}))} className="select">
            <option value="">Select brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </ModalField>
        <ModalField label="Category">
          <select value={form.CategoryId} onChange={e => setForm(f => ({...f, CategoryId: e.target.value}))} className="select">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </ModalField>
        <ModalField label="Description">
          <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="input resize-none" />
        </ModalField>
        <ModalField label="Quantity">
          <input type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} className="input" />
        </ModalField>
        <ModalField label="Price">
          <input type="number" min="0" step="0.01" value={form.unitprice} onChange={e => setForm(f => ({...f, unitprice: e.target.value}))} className="input" />
        </ModalField>
        <ModalField label="Image URL">
          <input value={form.imgurl} onChange={e => setForm(f => ({...f, imgurl: e.target.value}))} className="input" placeholder="https://..." />
        </ModalField>
        {selected && (
          <ModalField label="">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.isdeleted} onChange={e => setForm(f => ({...f, isdeleted: e.target.checked}))} className="accent-primary w-4 h-4" />
              <span className="text-gray-700">Is Deleted</span>
            </label>
          </ModalField>
        )}
        <ModalFooter onClose={() => setModalOpen(false)} onSave={handleSave} saveLabel={selected ? 'Save changes' : 'Add Product'} loading={saving} />
      </Modal>
    </div>
  )
}

// Toggle switch component for isdeleted
function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'left-4' : 'left-0.5'}`} />
    </div>
  )
}
