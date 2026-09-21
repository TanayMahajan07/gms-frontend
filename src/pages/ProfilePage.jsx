import { useCallback, useEffect, useState } from 'react'
import { fetchProfile, updateProfile } from '../api/profileApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import ProfileForm from '../components/profile/ProfileForm'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

export default function ProfilePage({ activeNav, onNavigate }) {
  const { auth, logout, updateSession } = useAuth()
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await fetchProfile({
        accessToken: auth.accessToken,
        onUnauthorized: logout,
      })
      setProfile(data)
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
      const data = await updateProfile({
        accessToken: auth.accessToken,
        payload,
        onUnauthorized: logout,
      })
      setProfile(data)
      updateSession({
        fullName: data.fullName,
        username: data.username,
      })
      setMessage('Profile updated')
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
      title="My Profile"
      eyebrow="Account"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <section className="panel settings-panel reveal">
        <div className="panel-heading">
          <h2>Personal details</h2>
        </div>
        <ProfileForm
          profile={profile}
          saving={saving}
          message={message}
          error={error}
          onSubmit={handleSubmit}
        />
      </section>
    </AppShell>
  )
}
