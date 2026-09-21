import { apiRequest } from './client'

export function fetchMembers({ accessToken, query, onUnauthorized }) {
  return apiRequest(`/api/members?${query}`, {
    accessToken,
    onUnauthorized,
  })
}

export function createMember({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/members', {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}

export function updateMember({ accessToken, id, payload, onUnauthorized }) {
  return apiRequest(`/api/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}

export function updateMemberStatus({ accessToken, id, active, onUnauthorized }) {
  return apiRequest(`/api/members/${id}/status?active=${active}`, {
    method: 'PATCH',
    accessToken,
    onUnauthorized,
  })
}
