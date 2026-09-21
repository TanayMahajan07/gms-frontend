import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loginRequest } from '../api/authApi'
import { clearAuth, loadAuth, saveAuth } from './authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth())

  const login = useCallback(async ({ username, password }) => {
    const data = await loginRequest({ username, password })
    saveAuth(data)
    setAuth(data)
    return data
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setAuth(null)
  }, [])

  const updateSession = useCallback((partial) => {
    setAuth((current) => {
      if (!current) return current
      const next = { ...current, ...partial }
      saveAuth(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.accessToken),
      login,
      logout,
      updateSession,
    }),
    [auth, login, logout, updateSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
