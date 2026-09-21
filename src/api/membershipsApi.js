import { apiRequest } from './client'

export function fetchMemberships({ accessToken, query, onUnauthorized }) {
  return apiRequest(`/api/memberships?${query}`, { accessToken, onUnauthorized })
}

export function createMembership({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/memberships', {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}

export function renewMembership({ accessToken, id, payload, onUnauthorized }) {
  return apiRequest(`/api/memberships/${id}/renew`, {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}
