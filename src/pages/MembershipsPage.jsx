import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMembers } from '../api/membersApi'
import { createMembership, fetchMemberships, renewMembership } from '../api/membershipsApi'
import { fetchActivePlans } from '../api/plansApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import CreateMembershipForm from '../components/memberships/CreateMembershipForm'
import MembershipList from '../components/memberships/MembershipList'
import RenewMembershipForm from '../components/memberships/RenewMembershipForm'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

const emptyForm = {
  memberId: '',
  planId: '',
  startDate: new Date().toISOString().slice(0, 10),
  amount: '',
}

const emptyRenewForm = {
  planId: '',
  amount: '',
}

export default function MembershipsPage({ activeNav = 'memberships', onNavigate }) {
  const { auth, logout } = useAuth()
  const [memberships, setMemberships] = useState([])
  const [members, setMembers] = useState([])
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [renewSource, setRenewSource] = useState(null)
  const [renewForm, setRenewForm] = useState(emptyRenewForm)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [renewing, setRenewing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [renewError, setRenewError] = useState('')
  const [renewMessage, setRenewMessage] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ size: '50', sort: 'id,desc' })
    if (search.trim()) params.set('search', search.trim())
    if (statusFilter !== 'all') params.set('status', statusFilter)
    return params.toString()
  }, [search, statusFilter])

  const loadMemberships = useCallback(async () => {
    if (!auth?.accessToken) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchMemberships({
        accessToken: auth.accessToken,
        query,
        onUnauthorized: logout,
      })
      setMemberships(data.content ?? [])
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setLoading(false)
    }
  }, [auth?.accessToken, logout, query])

  const loadOptions = useCallback(async () => {
    if (!auth?.accessToken) return
    try {
      const [memberPage, activePlans] = await Promise.all([
        fetchMembers({
          accessToken: auth.accessToken,
          query: 'size=100&sort=firstName,asc&active=true',
          onUnauthorized: logout,
        }),
        fetchActivePlans({
          accessToken: auth.accessToken,
          onUnauthorized: logout,
        }),
      ])
      setMembers(memberPage.content ?? [])
      setPlans(activePlans ?? [])
    } catch (err) {
      setFormError(formatApiValidationError(err))
    }
  }, [auth?.accessToken, logout])

  useEffect(() => {
    loadMemberships()
  }, [loadMemberships])

  useEffect(() => {
    loadOptions()
  }, [loadOptions])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateRenewField(field, value) {
    setRenewForm((current) => ({ ...current, [field]: value }))
  }

  function handleStartRenew(membership) {
    setRenewSource(membership)
    setRenewMessage('')
    setRenewError('')
    setFormMessage('')
    setFormError('')
    const matchingPlan = plans.find((plan) => String(plan.id) === String(membership.planId))
    setRenewForm({
      planId: String(membership.planId ?? ''),
      amount: matchingPlan ? String(matchingPlan.price) : String(membership.amount ?? ''),
    })
  }

  function handleCancelRenew() {
    setRenewSource(null)
    setRenewForm(emptyRenewForm)
    setRenewError('')
    setRenewMessage('')
  }

  async function handleCreate(payload) {
    setSaving(true)
    setFormError('')
    setFormMessage('')
    try {
      await createMembership({
        accessToken: auth.accessToken,
        payload,
        onUnauthorized: logout,
      })
      setFormMessage('Membership created')
      setForm(emptyForm)
      await loadMemberships()
      await loadOptions()
    } catch (err) {
      setFormError(formatApiValidationError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleRenew(payload) {
    if (!renewSource) return
    setRenewing(true)
    setRenewError('')
    setRenewMessage('')
    try {
      const created = await renewMembership({
        accessToken: auth.accessToken,
        id: renewSource.id,
        payload,
        onUnauthorized: logout,
      })
      setRenewMessage(`Renewed — ${created.membershipCode}`)
      setRenewSource(null)
      setRenewForm(emptyRenewForm)
      setMessage(`Renewed membership ${created.membershipCode}`)
      await loadMemberships()
      await loadOptions()
    } catch (err) {
      setRenewError(formatApiValidationError(err))
    } finally {
      setRenewing(false)
    }
  }

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Memberships"
      eyebrow="Membership Management"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <div className="content-grid">
        {renewSource ? (
          <RenewMembershipForm
            source={renewSource}
            plans={plans}
            form={renewForm}
            saving={renewing}
            message={renewMessage}
            error={renewError}
            onChange={updateRenewField}
            onSubmit={handleRenew}
            onCancel={handleCancelRenew}
          />
        ) : (
          <CreateMembershipForm
            members={members}
            plans={plans}
            form={form}
            saving={saving}
            message={formMessage}
            error={formError}
            onChange={updateField}
            onSubmit={handleCreate}
          />
        )}
        <MembershipList
          memberships={memberships}
          loading={loading}
          search={search}
          statusFilter={statusFilter}
          message={message}
          error={error}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onRefresh={loadMemberships}
          onRenew={handleStartRenew}
        />
      </div>
    </AppShell>
  )
}
