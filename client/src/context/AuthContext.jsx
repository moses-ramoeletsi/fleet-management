import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (ctx === null) throw new Error('useAuth() must be used inside <AuthProvider>')
  return ctx
}

const DEMO_CREDENTIALS = {
  email: 'admin@lec.co.ls',
  password: 'demo123',
  name: 'Ntate Khotso',
  role: 'Fleet Administrator',
  company: 'Lesotho Electricity Company'
}

const STORAGE_KEY = 'fleetpro-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          const userData = {
            email: DEMO_CREDENTIALS.email,
            name: DEMO_CREDENTIALS.name,
            role: DEMO_CREDENTIALS.role,
            company: DEMO_CREDENTIALS.company,
            loginTime: new Date().toISOString()
          }
          setUser(userData)
          resolve(userData)
        } else {
          reject(new Error('Invalid email or password. Please try again.'))
        }
      }, 800)
    })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}