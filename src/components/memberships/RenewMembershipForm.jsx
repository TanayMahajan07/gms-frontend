import { useMemo } from 'react'
import { calculateEndDate, calculateRenewStartDate } from '../../utils/membershipDates'

export default function RenewMembershipForm({
  source,
  plans,
  form,
  saving,
  message,
  error,
  onChange,
  onSubmit,
  onCancel,
}) {
  const selectedPlan = useMemo(
    () => plans.find((plan) => String(plan.id) === String(form.planId)),
    [form.planId, plans],
  )

  const startDate = useMemo(
    () => (source ? calculateRenewStartDate(source.endDate) : ''),
    [source],
  )

  const endDate = useMemo(
    () =>
      selectedPlan
        ? calculateEndDate(startDate, selectedPlan.duration, selectedPlan.durationUnit)
        : '',
    [selectedPlan, startDate],
  )

  if (!source) {
    return null
  }

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>Renew membership</h2>
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <form
        className="member-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit({
            planId: Number(form.planId),
            amount: Number(form.amount),
          })
        }}
      >
        <div className="field-grid">
          <label>
            <span>Source membership</span>
            <input value={source.membershipCode} readOnly disabled />
          </label>

          <label>
            <span>Member</span>
            <input
              value={`${source.memberCode || ''} — ${source.memberName || ''}`.trim()}
              readOnly
              disabled
            />
          </label>

          <label>
            <span>Current dates</span>
            <input
              value={`${source.startDate} → ${source.endDate} (${source.membershipStatus})`}
              readOnly
              disabled
            />
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
                  {plan.planName} ({plan.duration} {plan.durationUnit}) —{' '}
                  {Number(plan.price).toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>New start date (auto)</span>
            <input value={startDate} readOnly disabled />
          </label>

          <label>
            <span>New end date (auto)</span>
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

        <p className="login-help">
          If current end date is still ahead, new start = end + 1 day. If already past, new start =
          today. An ACTIVE source becomes EXPIRED when renewed.
        </p>

        {message && <div className="notice success">{message}</div>}
        {error && <div className="notice error">{error}</div>}

        <button type="submit" className="primary-button" disabled={saving || !endDate}>
          {saving ? 'Renewing...' : 'Confirm renew'}
        </button>
      </form>
    </section>
  )
}
