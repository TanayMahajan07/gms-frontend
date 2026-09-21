import { useState } from 'react'
import { createGymWithAdmin } from '../api/superAdminApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import CreateGymAdminForm from '../components/superadmin/CreateGymAdminForm'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

export default function CreateGymAdminPage({ activeNav, onNavigate }) {
  const { auth, logout } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState('')

  async function handleSubmit(payload) {
    setSaving(true)
    setError('')
    setResult(null)

    try {
      const data = await createGymWithAdmin({
        accessToken: auth.accessToken,
        payload,
        onUnauthorized: logout,
      })
      setResult(data)
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setSaving(false)
    }
  }

  async function copyText(label, value) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setTimeout(() => setCopied(''), 1600)
    } catch {
      setCopied('')
    }
  }

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Create Gym & Admin"
      eyebrow="Super Admin"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <div className="provision-layout">
        <div className="panel provision-panel">
          <div className="panel-heading">
            <h2>Provision a new gym</h2>
          </div>
          <CreateGymAdminForm saving={saving} error={error} onSubmit={handleSubmit} />
        </div>

        <aside className={`panel success-panel${result ? ' show' : ''}`}>
          {result ? (
            <>
              <p className="eyebrow">Ready</p>
              <h2>Gym created</h2>
              <p className="success-copy">
                Share these details with the gym owner so they can sign in and finish setup.
              </p>

              <dl className="credential-list">
                <div>
                  <dt>Gym code</dt>
                  <dd>
                    <code>{result.gymCode}</code>
                    <button type="button" className="text-button" onClick={() => copyText('code', result.gymCode)}>
                      {copied === 'code' ? 'Copied' : 'Copy'}
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Gym name</dt>
                  <dd>{result.gymName}</dd>
                </div>
                <div>
                  <dt>Admin username</dt>
                  <dd>
                    <code>{result.adminUsername}</code>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => copyText('user', result.adminUsername)}
                    >
                      {copied === 'user' ? 'Copied' : 'Copy'}
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Admin email</dt>
                  <dd>{result.adminEmail}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{result.adminRole}</dd>
                </div>
              </dl>

              <button type="button" className="primary-button" onClick={() => setResult(null)}>
                Create another
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">Tip</p>
              <h2>What happens next</h2>
              <ul className="tip-list">
                <li>Gym record is created as ACTIVE</li>
                <li>Default gym settings are seeded</li>
                <li>Admin can log in and edit profile + gym details</li>
              </ul>
            </>
          )}
        </aside>
      </div>
    </AppShell>
  )
}
