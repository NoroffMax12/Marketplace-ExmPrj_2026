/* Public login page — accessible without authentication. Checks that the logged in user has Admin role before granting access. */

import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import {login as loginApi} from '../api/auth.api'
import {ArrowRight, Mail, Lock} from 'lucide-react'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {login} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res  = await loginApi(email, password)
      const data = res.data?.data ?? res.data
      const role = data.role
      const token = data.token

      // Only allow Admin users into the panel
      if (role !== 'Admin') {
        setError('Access denied — admin accounts only.')
        setLoading(false)
        return
      }


      login({ role, username: data.username, email: data.email }, token)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.data?.result ||
        err.response?.data?.message ||
        'Invalid credentials. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left — hero image */}
      <div className="hidden lg:block lg:w-[62%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85&auto=format&fit=crop"
          alt="Tech gear"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-sidebar/90 via-sidebar/60 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="text-white/60 text-sm font-medium">EPAdmin</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-3">
            Manage your<br />
            <span className="text-primary">marketplace</span><br />
            with confidence.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Admin dashboard.<br />
            Full control over products, orders and users.
          </p>
        </div>
        <div className="absolute top-10 right-10 flex flex-col gap-2">
          {['Products & Inventory', 'Order Management', 'User Control'].map(f => (
            <div key={f} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-white/60 text-xs font-medium">
              ✦ {f}
            </div>
          ))}
        </div>
      </div>


      {/* Right — login form */}
      <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 bg-white">
        <div className="max-w-sm w-full mx-auto">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="font-semibold text-gray-900">EPAdmin</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-muted text-sm mb-8">Sign in as  admin</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input pl-9"
                />
              </div>
            </div>


            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input pl-9"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-danger font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Signing in...' : <><span>Sign me in</span><ArrowRight size={15} /></>}
            </button>
          </form>
        </div>

        <p className="text-xs text-muted text-center mt-auto pt-10">
          © EP Admin · All Rights Reserved Max Gb - 2026
        </p>
      </div>
    </div>
  )
}
