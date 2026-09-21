import { useMemo, useState } from 'react'
import {
  hasAdminSectionErrors,
  hasGymSectionErrors,
  validateCreateGymAdmin,
} from '../../utils/validators'

const emptyForm = {
  gymCode: '',
  gymName: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  email: '',
  currency: 'INR',
  dateFormat: 'dd-MM-yyyy',
  username: '',
  adminEmail: '',
  password: '',
  firstName: '',
  lastName: '',
  mobile: '',
}

export default function CreateGymAdminForm({ saving, error, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [activeSection, setActiveSection] = useState('gym')

  const errors = useMemo(() => validateCreateGymAdmin(form), [form])
  const gymDone = !hasGymSectionErrors(errors)
  const adminDone = !hasAdminSectionErrors(errors)
  const progress = useMemo(() => (gymDone ? 1 : 0) + (adminDone ? 1 : 0), [adminDone, gymDone])

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
    setTouched({
      gymCode: true,
      gymName: true,
      phone: true,
      email: true,
      username: true,
      adminEmail: true,
      password: true,
      firstName: true,
      lastName: true,
      mobile: true,
    })

    if (hasGymSectionErrors(errors)) {
      setActiveSection('gym')
      return
    }
    if (hasAdminSectionErrors(errors)) {
      setActiveSection('admin')
      return
    }

    onSubmit({
      gym: {
        gymCode: form.gymCode.trim(),
        gymName: form.gymName.trim(),
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        currency: form.currency,
        dateFormat: form.dateFormat,
      },
      admin: {
        username: form.username.trim(),
        email: form.adminEmail.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || null,
        mobile: form.mobile.trim() || null,
      },
    })
  }

  return (
    <form className="provision-form" onSubmit={handleSubmit} noValidate>
      <div className="provision-progress" aria-label="Form progress">
        <button
          type="button"
          className={`progress-step${activeSection === 'gym' ? ' current' : ''}${gymDone ? ' done' : ''}`}
          onClick={() => setActiveSection('gym')}
        >
          <span>1</span>
          Gym details
        </button>
        <div className={`progress-line${gymDone ? ' filled' : ''}`} />
        <button
          type="button"
          className={`progress-step${activeSection === 'admin' ? ' current' : ''}${adminDone ? ' done' : ''}`}
          onClick={() => setActiveSection('admin')}
        >
          <span>2</span>
          Gym owner
        </button>
        <div className="progress-meta">{progress}/2 complete</div>
      </div>

      <section className={`provision-section${activeSection === 'gym' ? ' visible' : ''}`}>
        <div className="section-intro">
          <h2>Gym details</h2>
          <p>Create the gym tenant. The owner account will be linked to this gym.</p>
        </div>

        <div className="field-grid">
          <label>
            <span>Gym code</span>
            <input
              className={showError('gymCode') ? 'invalid' : ''}
              value={form.gymCode}
              onChange={(e) => update('gymCode', e.target.value.toUpperCase())}
              onBlur={() => markTouched('gymCode')}
              placeholder="GYM-002"
            />
            {showError('gymCode') && <em className="field-hint error">{showError('gymCode')}</em>}
          </label>
          <label>
            <span>Gym name</span>
            <input
              className={showError('gymName') ? 'invalid' : ''}
              value={form.gymName}
              onChange={(e) => update('gymName', e.target.value)}
              onBlur={() => markTouched('gymName')}
              placeholder="Iron Peak Fitness"
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
        </div>

        <label>
          <span>Address</span>
          <textarea value={form.address} onChange={(e) => update('address', e.target.value)} rows="2" />
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setTouched((current) => ({ ...current, gymCode: true, gymName: true, phone: true, email: true }))
              if (gymDone) setActiveSection('admin')
            }}
          >
            Continue to owner
          </button>
        </div>
      </section>

      <section className={`provision-section${activeSection === 'admin' ? ' visible' : ''}`}>
        <div className="section-intro">
          <h2>Gym owner (Admin)</h2>
          <p>This login will manage members, plans, payments, and gym settings.</p>
        </div>

        <div className="field-grid">
          <label>
            <span>Username</span>
            <input
              className={showError('username') ? 'invalid' : ''}
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              onBlur={() => markTouched('username')}
              autoComplete="off"
            />
            {showError('username') && <em className="field-hint error">{showError('username')}</em>}
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              className={showError('adminEmail') ? 'invalid' : ''}
              value={form.adminEmail}
              onChange={(e) => update('adminEmail', e.target.value)}
              onBlur={() => markTouched('adminEmail')}
            />
            {showError('adminEmail') && <em className="field-hint error">{showError('adminEmail')}</em>}
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              className={showError('password') ? 'invalid' : ''}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              onBlur={() => markTouched('password')}
              autoComplete="new-password"
            />
            {showError('password') && <em className="field-hint error">{showError('password')}</em>}
          </label>
          <label>
            <span>Mobile</span>
            <input
              className={showError('mobile') ? 'invalid' : ''}
              value={form.mobile}
              onChange={(e) => update('mobile', e.target.value)}
              onBlur={() => markTouched('mobile')}
            />
            {showError('mobile') && <em className="field-hint error">{showError('mobile')}</em>}
          </label>
          <label>
            <span>First name</span>
            <input
              className={showError('firstName') ? 'invalid' : ''}
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              onBlur={() => markTouched('firstName')}
            />
            {showError('firstName') && <em className="field-hint error">{showError('firstName')}</em>}
          </label>
          <label>
            <span>Last name</span>
            <input
              className={showError('lastName') ? 'invalid' : ''}
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              onBlur={() => markTouched('lastName')}
            />
            {showError('lastName') && <em className="field-hint error">{showError('lastName')}</em>}
          </label>
        </div>

        {error && <div className="notice error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="text-button" onClick={() => setActiveSection('gym')}>
            Back
          </button>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? 'Creating...' : 'Create gym & admin'}
          </button>
        </div>
      </section>
    </form>
  )
}
