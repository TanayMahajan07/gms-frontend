import { useCallback, useEffect, useState } from 'react'
import { fetchMyGym, updateMyGym } from '../api/gymApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import GymSettingsForm from '../components/gym/GymSettingsForm'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

export default function GymSettingsPage({ activeNav, onNavigate }) {
  const { auth, logout } = useAuth()
  const [gym, setGym] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await fetchMyGym({
        accessToken: auth.accessToken,
        onUnauthorized: logout,
      })
      setGym(data)
    } catch (err) {
      setError(err.message)
    }
  }, [auth.accessToken, logout])

  useEffect(() => {
    load()
  }, [load])

  async function handleSubmit(payload) {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const data = await updateMyGym({
        accessToken: auth.accessToken,
        payload,
        onUnauthorized: logout,
      })
      setGym(data)
      setMessage('Gym settings saved')
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Gym Settings"
      eyebrow="Administration"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <section className="panel settings-panel reveal">
        <div className="panel-heading">
          <h2>Gym profile</h2>
        </div>
        {error && !gym && <div className="notice error">{error}</div>}
        <GymSettingsForm
          gym={gym}
          saving={saving}
          message={message}
          error={error}
          onSubmit={handleSubmit}
        />
      </section>
    </AppShell>
  )
}
