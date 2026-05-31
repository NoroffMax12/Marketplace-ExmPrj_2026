// Global toast notification system.
// Provides addToast() to any component in the app.
import {createContext, useContext, useState, useCallback} from 'react'
import {CheckCircle, XCircle, Info, X} from 'lucide-react'

const ToastContext = createContext(null)

// Icon and style mappings per toast/popup notification type
const ICON = {success: CheckCircle, error: XCircle, info: Info}
const COLOR = {
  success: 'border-l-4 border-primary',
  error: 'border-l-4 border-danger',
  info: 'border-l-4 border-blue-500',
}

const ICON_COLOR = {
  success: 'text-primary',
  error: 'text-danger',
  info: 'text-blue-500',
}

// The ToastProvider manages an array of active notifications.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() // - addToast function creates unique ID using Date.now(), appends the new toast to state, and triggers a setTimeout nd dismises it after 3.5 seconds.

    setToasts(prev => [...prev, {id, message, type}])
    // Auto-dismiss after 3.5 sec
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])


  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}


      {/* Toast container — fixed top right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICON[type] || Info
          return (
            <div
              key={id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-card-hover
                bg-white min-w-[260px] max-w-sm pointer-events-auto animate-fade-in
                ${COLOR[type] || COLOR.info}`}
            >


              <Icon size={16} className={`flex-shrink-0 ${ICON_COLOR[type]}`} />
              <span className="flex-1 text-sm font-medium text-gray-800">{message}</span>
              <button onClick={() => remove(id)} className="text-muted hover:text-gray-600">
                <X size={13} />
              </button>
            </div>
   
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext) // Custom hook that can be called to gain access to component.
