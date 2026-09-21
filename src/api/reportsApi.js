import { apiRequest } from './client'

export function fetchReports({ accessToken, from, to, onUnauthorized }) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const query = params.toString()
  return apiRequest(`/api/reports${query ? `?${query}` : ''}`, {
    accessToken,
    onUnauthorized,
  })
}
