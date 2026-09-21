import { apiRequest } from './client'

export function fetchPlans({ accessToken, query, onUnauthorized }) {
  return apiRequest(`/api/plans?${query}`, { accessToken, onUnauthorized })
}

export function fetchActivePlans({ accessToken, onUnauthorized }) {
  return apiRequest('/api/plans/active', { accessToken, onUnauthorized })
}

export function createPlan({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/plans', {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}

export function updatePlan({ accessToken, id, payload, onUnauthorized }) {
  return apiRequest(`/api/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}

export function updatePlanStatus({ accessToken, id, active, onUnauthorized }) {
  return apiRequest(`/api/plans/${id}/status?active=${active}`, {
    method: 'PATCH',
    accessToken,
    onUnauthorized,
  })
}
