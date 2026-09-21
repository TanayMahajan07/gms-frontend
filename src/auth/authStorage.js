import { AUTH_STORAGE_KEY } from '../constants/config'

export function loadAuth() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function saveAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
