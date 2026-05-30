/* Reusable modal component used across all pages. Closes on backdrop click or escape key.*/

import {useEffect} from 'react'
import { X } from 'lucide-react'

export default function Modal({isOpen, onClose, title, children, size = 'md' }) { // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }

    window.addEventListener('keydown', handler)
    return() => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null


  const sizeClass = {sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' }[size] || 'max-w-xl'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />


      {/* Modal panel */}
      <div className={`relative bg-white rounded-2xl shadow-modal w-full ${sizeClass} max-h-[88vh] flex flex-col animate-fade-in`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-surface hover:text-gray-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>


        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// Labeled field wrapper inside modals
export function ModalField({ label, helper, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {helper && <p className="text-xs text-muted mt-1">{helper}</p>}
    </div>
  )
}

// Footer w close/ save btns
export function ModalFooter({ onClose, onSave, saveLabel = 'Save changes', loading = false }) {
  return (
    <div className="flex justify-end gap-2.5 pt-4 border-t border-border mt-2">
      <button onClick={onClose} className="btn-secondary">Close</button>
      <button onClick={onSave} disabled={loading} className="btn-primary disabled:opacity-50">
        {loading ? 'Saving...' : saveLabel}
      </button>
    </div>
  )
}
