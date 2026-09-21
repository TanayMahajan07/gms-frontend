import { apiRequest } from './client'

export function fetchDashboard({ accessToken, onUnauthorized }) {
  return apiRequest('/api/dashboard', { accessToken, onUnauthorized })
}
