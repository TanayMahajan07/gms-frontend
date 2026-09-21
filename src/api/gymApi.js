import { apiRequest } from './client'

export function fetchMyGym({ accessToken, onUnauthorized }) {
  return apiRequest('/api/me/gym', { accessToken, onUnauthorized })
}

export function updateMyGym({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/me/gym', {
    method: 'PUT',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}
