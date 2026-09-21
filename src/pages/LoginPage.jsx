import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [loginForm, setLoginForm] = useState({
    username: 'superadmin',
    password: 'superadmin123',
  })
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoggingIn(true)
    setError('')

    try {
      await login(loginForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div>
          <p className="eyebrow">GMS MVP</p>
          <h1>Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Username</span>
            <input
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm((current) => ({ ...current, username: e.target.value }))
              }
              autoComplete="username"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((current) => ({ ...current, password: e.target.value }))
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="notice error">{error}</div>}

          <button type="submit" className="primary-button" disabled={loggingIn}>
            {loggingIn ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-help">Default Super Admin: superadmin / superadmin123</p>
      </section>
    </main>
  )
}
