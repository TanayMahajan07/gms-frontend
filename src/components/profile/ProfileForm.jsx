import { useEffect, useMemo, useState } from 'react'
import { validateProfile } from '../../utils/validators'

export default function ProfileForm({
  profile,
  saving,
  message,
  error,
  onSubmit,
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    currentPassword: '',
    newPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    if (!profile) return
    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      email: profile.email ?? '',
      mobile: profile.mobile ?? '',
      currentPassword: '',
      newPassword: '',
    })
    setTouched({})
    setSubmitAttempted(false)
  }, [profile])

  const errors = useMemo(
    () => validateProfile(form, { changingPassword: showPassword }),
    [form, showPassword],
  )

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

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || null,
      email: form.email.trim(),
      mobile: form.mobile.trim() || null,
    }
    if (showPassword) {
      payload.currentPassword = form.currentPassword
      payload.newPassword = form.newPassword
    }
    onSubmit(payload)
  }

  if (!profile) {
    return <div className="notice">Loading profile...</div>
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <label>
          <span>Username</span>
          <input value={profile.username} disabled />
        </label>
        <label>
          <span>Role</span>
          <input value={profile.role} disabled />
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
          <span>Mobile</span>
          <input
            className={showError('mobile') ? 'invalid' : ''}
            value={form.mobile}
            onChange={(e) => update('mobile', e.target.value)}
            onBlur={() => markTouched('mobile')}
          />
          {showError('mobile') && <em className="field-hint error">{showError('mobile')}</em>}
        </label>
      </div>

      <button
        type="button"
        className={`accordion-toggle${showPassword ? ' open' : ''}`}
        onClick={() => setShowPassword((value) => !value)}
      >
        Change password
        <span>{showPassword ? '−' : '+'}</span>
      </button>

      {showPassword && (
        <div className="accordion-body field-grid">
          <label>
            <span>Current password</span>
            <input
              type="password"
              className={showError('currentPassword') ? 'invalid' : ''}
              value={form.currentPassword}
              onChange={(e) => update('currentPassword', e.target.value)}
              onBlur={() => markTouched('currentPassword')}
              autoComplete="current-password"
            />
            {showError('currentPassword') && (
              <em className="field-hint error">{showError('currentPassword')}</em>
            )}
          </label>
          <label>
            <span>New password</span>
            <input
              type="password"
              className={showError('newPassword') ? 'invalid' : ''}
              value={form.newPassword}
              onChange={(e) => update('newPassword', e.target.value)}
              onBlur={() => markTouched('newPassword')}
              autoComplete="new-password"
            />
            {showError('newPassword') && (
              <em className="field-hint error">{showError('newPassword')}</em>
            )}
          </label>
        </div>
      )}

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <button type="submit" className="primary-button" disabled={saving}>
        {saving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}
