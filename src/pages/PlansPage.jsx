import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createPlan,
  fetchPlans,
  updatePlan,
  updatePlanStatus,
} from '../api/plansApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import PlanForm from '../components/plans/PlanForm'
import PlanList from '../components/plans/PlanList'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

const emptyForm = {
  id: null,
  planName: '',
  duration: 1,
  durationUnit: 'MONTH',
  price: '1000',
  description: '',
  active: true,
}

export default function PlansPage({ activeNav = 'plans', onNavigate }) {
  const { auth, logout } = useAuth()
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ size: '50', sort: 'id,desc' })
    if (search.trim()) params.set('search', search.trim())
    if (activeFilter !== 'all') params.set('active', activeFilter)
    return params.toString()
  }, [activeFilter, search])

  const loadPlans = useCallback(async () => {
    if (!auth?.accessToken) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchPlans({
        accessToken: auth.accessToken,
        query,
        onUnauthorized: logout,
      })
      setPlans(data.content ?? [])
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setLoading(false)
    }
  }, [auth?.accessToken, logout, query])

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setMessage('')
    setError('')
  }

  function editPlan(plan) {
    setForm({
      id: plan.id,
      planName: plan.planName ?? '',
      duration: plan.duration ?? 1,
      durationUnit: plan.durationUnit ?? 'MONTH',
      price: String(plan.price ?? ''),
      description: plan.description ?? '',
      active: plan.active ?? true,
    })
    setMessage('')
    setError('')
  }

  async function savePlan(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const payload = {
      planName: form.planName.trim(),
      duration: Number(form.duration),
      durationUnit: form.durationUnit,
      price: Number(form.price),
      description: form.description.trim() || null,
      active: form.active,
    }

    try {
      if (form.id) {
        await updatePlan({
          accessToken: auth.accessToken,
          id: form.id,
          payload,
          onUnauthorized: logout,
        })
        setMessage('Plan updated')
      } else {
        await createPlan({
          accessToken: auth.accessToken,
          payload,
          onUnauthorized: logout,
        })
        setMessage('Plan created')
      }
      resetForm()
      await loadPlans()
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(plan) {
    setError('')
    setMessage('')
    try {
      await updatePlanStatus({
        accessToken: auth.accessToken,
        id: plan.id,
        active: !plan.active,
        onUnauthorized: logout,
      })
      setMessage(`${plan.planName} ${!plan.active ? 'activated' : 'deactivated'}`)
      await loadPlans()
    } catch (err) {
      setError(formatApiValidationError(err))
    }
  }

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Plans"
      eyebrow="Membership Plans"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <div className="content-grid">
        <PlanForm
          form={form}
          saving={saving}
          onChange={updateField}
          onSubmit={savePlan}
          onClear={resetForm}
        />
        <PlanList
          plans={plans}
          loading={loading}
          search={search}
          activeFilter={activeFilter}
          message={message}
          error={error}
          onSearchChange={setSearch}
          onActiveFilterChange={setActiveFilter}
          onRefresh={loadPlans}
          onEdit={editPlan}
          onToggleStatus={toggleStatus}
        />
      </div>
    </AppShell>
  )
}
