import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMemberships } from '../api/membershipsApi'
import {
  createPayment,
  fetchMembershipPaymentSummary,
  fetchPayments,
} from '../api/paymentsApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import PaymentList from '../components/payments/PaymentList'
import RecordPaymentForm from '../components/payments/RecordPaymentForm'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

const emptyForm = {
  membershipId: '',
  amount: '',
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMethod: 'CASH',
  transactionReference: '',
  remarks: '',
}

export default function PaymentsPage({ activeNav = 'payments', onNavigate }) {
  const { auth, logout } = useAuth()
  const [payments, setPayments] = useState([])
  const [memberships, setMemberships] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ size: '50', sort: 'id,desc' })
    if (search.trim()) params.set('search', search.trim())
    if (statusFilter !== 'all') params.set('status', statusFilter)
    return params.toString()
  }, [search, statusFilter])

  const loadPayments = useCallback(async () => {
    if (!auth?.accessToken) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchPayments({
        accessToken: auth.accessToken,
        query,
        onUnauthorized: logout,
      })
      setPayments(data.content ?? [])
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setLoading(false)
    }
  }, [auth?.accessToken, logout, query])

  const loadMembershipOptions = useCallback(async () => {
    if (!auth?.accessToken) return
    try {
      const data = await fetchMemberships({
        accessToken: auth.accessToken,
        query: 'size=100&sort=id,desc',
        onUnauthorized: logout,
      })
      setMemberships(data.content ?? [])
    } catch (err) {
      setFormError(formatApiValidationError(err))
    }
  }, [auth?.accessToken, logout])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  useEffect(() => {
    loadMembershipOptions()
  }, [loadMembershipOptions])

  useEffect(() => {
    if (!auth?.accessToken || !form.membershipId) {
      setSummary(null)
      return
    }

    let cancelled = false
    async function loadSummary() {
      setSummaryLoading(true)
      setFormError('')
      try {
        const data = await fetchMembershipPaymentSummary({
          accessToken: auth.accessToken,
          membershipId: form.membershipId,
          onUnauthorized: logout,
        })
        if (cancelled) return
        setSummary(data)
        const balance = Number(data.balance)
        setForm((current) => ({
          ...current,
          amount: balance > 0 ? String(balance) : '',
        }))
      } catch (err) {
        if (!cancelled) {
          setSummary(null)
          setFormError(formatApiValidationError(err))
        }
      } finally {
        if (!cancelled) setSummaryLoading(false)
      }
    }

    loadSummary()
    return () => {
      cancelled = true
    }
  }, [auth?.accessToken, form.membershipId, logout])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleCreate(payload) {
    setSaving(true)
    setFormError('')
    setFormMessage('')
    try {
      const created = await createPayment({
        accessToken: auth.accessToken,
        payload,
        onUnauthorized: logout,
      })
      setFormMessage(`Payment recorded — ${created.paymentReference}`)
      setForm({
        ...emptyForm,
        paymentDate: new Date().toISOString().slice(0, 10),
      })
      setSummary(null)
      await loadPayments()
      await loadMembershipOptions()
    } catch (err) {
      setFormError(formatApiValidationError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Payments"
      eyebrow="Payment Management"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <div className="content-grid">
        <RecordPaymentForm
          memberships={memberships}
          form={form}
          summary={summary}
          summaryLoading={summaryLoading}
          saving={saving}
          message={formMessage}
          error={formError}
          onChange={updateField}
          onSubmit={handleCreate}
        />
        <PaymentList
          payments={payments}
          loading={loading}
          search={search}
          statusFilter={statusFilter}
          message={message}
          error={error}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onRefresh={loadPayments}
        />
      </div>
    </AppShell>
  )
}
