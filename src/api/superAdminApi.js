import { apiRequest } from './client'

export function createGymWithAdmin({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/superadmin/gyms', {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}
