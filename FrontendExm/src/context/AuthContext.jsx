// Global authentication state manager.
// Stores user nd token, handles login/logout.
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {//NTS: Component allows children to reuse avaliable date provided by (AuthProvider= which works as wrapper)

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on page refresh
  useEffect(() => {// NTS: This useEffect only runs once when the app loads ([]). It checks localStorage for existing token & user so the user stays logged in after a page refresh.


    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false) //sets loading to false so UI knows the auth-check is done and can stop loading.


  }, [])
  const login = (userData, tokenValue) => { //NTS: Login function is called after successful API login. It updates state (setUser, setToken) so UI updates instantly, and simultaneously saves the data to localStorage (using JSON.stringify for user object)


    setUser(userData)
    setToken(tokenValue)
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {//NTS: Logout function does the exact opposite of login...duh
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAdmin: user?.role === 'Admin',
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext) // Custom hook that can be called to gain access to component.
