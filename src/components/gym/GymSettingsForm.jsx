import { useEffect, useMemo, useState } from 'react'
import { validateGymSettings } from '../../utils/validators'

export default function GymSettingsForm({ gym, saving, message, error, onSubmit }) {
  const [form, setForm] = useState({
    gymName: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    logo: '',
    currency: 'INR',
    dateFormat: 'dd-MM-yyyy',
    expiryAlertThresholds: '3,7,15,30',
    receiptPrefix: 'RCPT',
  })
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    if (!gym) return
    setForm({
      gymName: gym.gymName ?? '',
      address: gym.address ?? '',
      city: gym.city ?? '',
      state: gym.state ?? '',
      phone: gym.phone ?? '',
      email: gym.email ?? '',
      logo: gym.logo ?? '',
      currency: gym.currency ?? 'INR',
      dateFormat: gym.dateFormat ?? 'dd-MM-yyyy',
      expiryAlertThresholds: gym.expiryAlertThresholds ?? '3,7,15,30',
      receiptPrefix: gym.receiptPrefix ?? 'RCPT',
    })
    setTouched({})
    setSubmitAttempted(false)
  }, [gym])

  const errors = useMemo(() => validateGymSettings(form), [form])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function markTouched(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function showError(field) {
    if (!(touched[field] || submitAttempted)) return null
    return errors[field] || null
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitAttempted(true)
    if (Object.keys(errors).length > 0) return

    onSubmit({
      gymName: form.gymName.trim(),
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      logo: form.logo.trim() || null,
      currency: form.currency,
      dateFormat: form.dateFormat,
      expiryAlertThresholds: form.expiryAlertThresholds.trim(),
      receiptPrefix: form.receiptPrefix.trim(),
    })
  }

  if (!gym) {
    return <div className="notice">Loading gym settings...</div>
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <div className="gym-hero-strip">
        <div>
          <p className="eyebrow">{gym.gymCode}</p>
          <h2>{form.gymName || gym.gymName}</h2>
        </div>
        <span className={`status ${gym.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
          {gym.status}
        </span>
      </div>

      <div className="field-grid">
        <label>
          <span>Gym name</span>
          <input
            className={showError('gymName') ? 'invalid' : ''}
            value={form.gymName}
            onChange={(e) => update('gymName', e.target.value)}
            onBlur={() => markTouched('gymName')}
          />
          {showError('gymName') && <em className="field-hint error">{showError('gymName')}</em>}
        </label>
        <label>
          <span>Phone</span>
          <input
            className={showError('phone') ? 'invalid' : ''}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={() => markTouched('phone')}
          />
          {showError('phone') && <em className="field-hint error">{showError('phone')}</em>}
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            className={showError('email') ? 'invalid' : ''}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => markTouched('email')}
          />
          {showError('email') && <em className="field-hint error">{showError('email')}</em>}
        </label>
        <label>
          <span>Logo URL</span>
          <input
            className={showError('logo') ? 'invalid' : ''}
            value={form.logo}
            onChange={(e) => update('logo', e.target.value)}
            onBlur={() => markTouched('logo')}
            placeholder="https://..."
          />
          {showError('logo') && <em className="field-hint error">{showError('logo')}</em>}
        </label>
        <label>
          <span>City</span>
          <input value={form.city} onChange={(e) => update('city', e.target.value)} />
        </label>
        <label>
          <span>State</span>
          <input value={form.state} onChange={(e) => update('state', e.target.value)} />
        </label>
        <label>
          <span>Currency</span>
          <select value={form.currency} onChange={(e) => update('currency', e.target.value)}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label>
          <span>Date format</span>
          <select value={form.dateFormat} onChange={(e) => update('dateFormat', e.target.value)}>
            <option value="dd-MM-yyyy">dd-MM-yyyy</option>
            <option value="MM-dd-yyyy">MM-dd-yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
          </select>
        </label>
        <label>
          <span>Expiry alert thresholds</span>
          <input
            className={showError('expiryAlertThresholds') ? 'invalid' : ''}
            value={form.expiryAlertThresholds}
            onChange={(e) => update('expiryAlertThresholds', e.target.value)}
            onBlur={() => markTouched('expiryAlertThresholds')}
            placeholder="3,7,15,30"
          />
          {showError('expiryAlertThresholds') && (
            <em className="field-hint error">{showError('expiryAlertThresholds')}</em>
          )}
        </label>
        <label>
          <span>Receipt prefix</span>
          <input
            className={showError('receiptPrefix') ? 'invalid' : ''}
            value={form.receiptPrefix}
            onChange={(e) => update('receiptPrefix', e.target.value)}
            onBlur={() => markTouched('receiptPrefix')}
          />
          {showError('receiptPrefix') && (
            <em className="field-hint error">{showError('receiptPrefix')}</em>
          )}
        </label>
      </div>

      <label>
        <span>Address</span>
        <textarea value={form.address} onChange={(e) => update('address', e.target.value)} rows="2" />
      </label>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <button type="submit" className="primary-button" disabled={saving}>
        {saving ? 'Saving...' : 'Save gym settings'}
      </button>
    </form>
  )
}
