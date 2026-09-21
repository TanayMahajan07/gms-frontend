import { apiRequest } from './client'

export function fetchProfile({ accessToken, onUnauthorized }) {
  return apiRequest('/api/me/profile', { accessToken, onUnauthorized })
}

export function updateProfile({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/me/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}
