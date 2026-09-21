import { apiRequest } from './client'

export function fetchPayments({ accessToken, query, onUnauthorized }) {
  return apiRequest(`/api/payments?${query}`, { accessToken, onUnauthorized })
}

export function createPayment({ accessToken, payload, onUnauthorized }) {
  return apiRequest('/api/payments', {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
    onUnauthorized,
  })
}

export function fetchMembershipPaymentSummary({ accessToken, membershipId, onUnauthorized }) {
  return apiRequest(`/api/payments/membership/${membershipId}/summary`, {
    accessToken,
    onUnauthorized,
  })
}
