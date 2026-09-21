import { useMemo } from 'react'
import { calculateEndDate } from '../../utils/membershipDates'

export default function CreateMembershipForm({
  members,
  plans,
  form,
  saving,
  message,
  error,
  onChange,
  onSubmit,
}) {
  const selectedPlan = useMemo(
    () => plans.find((plan) => String(plan.id) === String(form.planId)),
    [form.planId, plans],
  )

  const endDate = useMemo(
    () =>
      selectedPlan
        ? calculateEndDate(form.startDate, selectedPlan.duration, selectedPlan.durationUnit)
        : '',
    [form.startDate, selectedPlan],
  )

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>Create membership</h2>
      </div>

      <form
        className="member-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit({
            memberId: Number(form.memberId),
            planId: Number(form.planId),
            startDate: form.startDate,
            amount: Number(form.amount),
          })
        }}
      >
        <div className="field-grid">
          <label>
            <span>Member</span>
            <select
              required
              value={form.memberId}
              onChange={(e) => onChange('memberId', e.target.value)}
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.memberCode} — {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Plan</span>
            <select
              required
              value={form.planId}
              onChange={(e) => {
                const planId = e.target.value
                onChange('planId', planId)
                const plan = plans.find((item) => String(item.id) === String(planId))
                if (plan) onChange('amount', String(plan.price))
              }}
            >
              <option value="">Select plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.planName} ({plan.duration} {plan.durationUnit}) — {Number(plan.price).toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Start date</span>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
            />
          </label>

          <label>
            <span>End date (auto)</span>
            <input value={endDate} readOnly disabled />
          </label>

          <label>
            <span>Amount</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => onChange('amount', e.target.value)}
            />
          </label>
        </div>

        {selectedPlan && (
          <p className="login-help">
            Inclusive rule: {form.startDate || 'start'} + {selectedPlan.duration}{' '}
            {selectedPlan.durationUnit} − 1 day = {endDate || '—'}
          </p>
        )}

        {message && <div className="notice success">{message}</div>}
        {error && <div className="notice error">{error}</div>}

        <button type="submit" className="primary-button" disabled={saving || !endDate}>
          {saving ? 'Creating...' : 'Create membership'}
        </button>
      </form>
    </section>
  )
}
