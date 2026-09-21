import { API_BASE_URL } from '../constants/config'
import { clearAuth } from '../auth/authStorage'

export async function apiRequest(path, { accessToken, onUnauthorized, ...options } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth()
      onUnauthorized?.()
    }
    const error = new Error(data?.message ?? 'Request failed')
    error.status = response.status
    error.validationErrors = data?.validationErrors ?? null
    throw error
  }

  return data
}
