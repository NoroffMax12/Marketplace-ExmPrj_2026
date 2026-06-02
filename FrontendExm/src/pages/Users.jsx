/* Users management page.
- Admin can view all users and update user details and role.*/

import {useState, useEffect} from 'react'
import Modal, {ModalField, ModalFooter} from '../components/Modal'
import Badge from '../components/Badge'
import {useToast} from '../context/ToastContext'
import {getUsers, updateUser} from '../api/users.api'

// RoleId mapping matching the roles table in DB
const ROLE_TO_ID = {Admin: 1, User: 2 }
const ID_TO_ROLE = { 1: 'Admin', 2: 'User' }

export default function Users() {
  const {addToast} = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({firstname: '', lastname: '', email: '', role: 'User'})


  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await getUsers()
      setUsers(res.data?.data?.users || [])
    } catch {addToast('Failed to load users', 'error') }
    finally {setLoading(false) }
  }

  const openEdit = (user) => {
    setSelected(user)
    setForm({
      firstname: user.firstname || '',
      lastname:  user.lastname  || '',
      email:     user.email     || '',
      // Resolve role name from RoleId for dropdown display
      role: ID_TO_ROLE[user.RoleId] || 'User',
    })
    setModalOpen(true)
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        firstname: form.firstname,
        lastname:  form.lastname,
        email:     form.email,
        RoleId:    ROLE_TO_ID[form.role] ?? 2,
      }
      await updateUser(selected.id, payload)
      addToast('User updated')
      setModalOpen(false)
      fetchUsers()
    } catch { addToast('Update failed', 'error') }
    finally { setSaving(false) }
  }


  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium">Current registered users</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border">
              {['Id','Username','First Name','Last Name','Email','Address','Telephone','Role','Membership','Options'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>

            {loading ? (
              <tr><td colSpan={10} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={10} className="px-5 py-10 text-center text-muted">No users found</td></tr>
            ) : users.map((user, i) => (
              <tr key={user.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                <td className="px-4 py-3 text-muted">{user.id}</td>
                <td className="px-4 py-3 font-medium">{user.username}</td>
                <td className="px-4 py-3">{user.firstname}</td>
                <td className="px-4 py-3">{user.lastname}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3 text-muted">{user.address || '—'}</td>
                <td className="px-4 py-3 text-muted">{user.telephone || '—'}</td>
                {/* Resolve role name from RoleId */}
                <td className="px-4 py-3">{ID_TO_ROLE[user.RoleId] || '—'}</td>
                {/* Membership is a nested object */}
                <td className="px-4 py-3"><Badge label={user.Membership?.name || 'Bronze'} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(user)} className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 flex items-center justify-center transition-colors">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit user details" size="sm">
        {selected && (
          <>
            <ModalField label="Id">
              <input disabled value={selected.id} className="input bg-surface cursor-not-allowed" />
            </ModalField>
            <ModalField label="Email">
              <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input" />
            </ModalField>
            <ModalField label="First Name">
              <input value={form.firstname} onChange={e => setForm(f => ({...f, firstname: e.target.value}))} className="input" />
            </ModalField>
            <ModalField label="Last Name">
              <input value={form.lastname} onChange={e => setForm(f => ({...f, lastname: e.target.value}))} className="input" />
            </ModalField>
            {/* Dropdown shows Admin/User — maps to RoleId 1/2 on save */}
            <ModalField label="Role">
              <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} className="select">
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </ModalField>
          </>
        )}
        <ModalFooter onClose={() => setModalOpen(false)} onSave={handleSave} saveLabel="Save changes" loading={saving} />
      </Modal>
    </div>
  )
}
