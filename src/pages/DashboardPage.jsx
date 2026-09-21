import { useCallback, useEffect, useState } from 'react'
import { fetchDashboard } from '../api/dashboardApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

export default function DashboardPage({ activeNav = 'dashboard', onNavigate }) {
  const { auth, logout } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!auth?.accessToken) return
    setLoading(true)
    setError('')
    try {
      const response = await fetchDashboard({
        accessToken: auth.accessToken,
        onUnauthorized: logout,
      })
      setData(response)
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setLoading(false)
    }
  }, [auth?.accessToken, logout])

  useEffect(() => {
    load()
  }, [load])

  const summary = data?.summary
  const expiringSoon = data?.expiringSoon ?? []
  const expiredNeedingRenew = data?.expiredNeedingRenew ?? []

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Dashboard"
      eyebrow="Gym Overview"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <div className="panel-heading" style={{ marginBottom: 16 }}>
        <div />
        <button type="button" className="text-button" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && <div className="notice error">{error}</div>}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
        <div className="stat">
          <span>Active</span>
          <strong>{loading && !summary ? '…' : (summary?.activeCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Expiring soon</span>
          <strong>{loading && !summary ? '…' : (summary?.expiringSoonCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Needs renew</span>
          <strong>{loading && !summary ? '…' : (summary?.expiredNeedingRenewCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Outstanding</span>
          <strong>{loading && !summary ? '…' : (summary?.outstandingCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Outstanding amount</span>
          <strong>
            {loading && !summary
              ? '…'
              : Number(summary?.outstandingAmount ?? 0).toFixed(2)}
          </strong>
        </div>
      </div>

      {summary?.expiryHorizonDays != null && (
        <p className="login-help" style={{ marginBottom: 16 }}>
          Expiring soon = ACTIVE memberships ending within {summary.expiryHorizonDays} day(s)
          (from Gym Settings thresholds). Past-due ACTIVE rows auto-expire daily.
        </p>
      )}

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="panel list-panel">
          <div className="panel-heading">
            <h2>Expiring soon</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>End</th>
                  <th>Days</th>
                  <th>Bucket</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading && expiringSoon.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      Loading...
                    </td>
                  </tr>
                ) : expiringSoon.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No memberships expiring soon
                    </td>
                  </tr>
                ) : (
                  expiringSoon.map((item) => (
                    <tr key={item.membershipId}>
                      <td>{item.membershipCode}</td>
                      <td>
                        <strong>{item.memberName}</strong>
                        <span>{item.memberCode}</span>
                      </td>
                      <td>{item.planName}</td>
                      <td>{item.endDate}</td>
                      <td>{item.daysLeft}</td>
                      <td>{item.nearestThresholdBucket}d</td>
                      <td>
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => onNavigate?.('memberships')}
                        >
                          Memberships
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel list-panel">
          <div className="panel-heading">
            <h2>Expired — needs renew</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>End</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading && expiredNeedingRenew.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Loading...
                    </td>
                  </tr>
                ) : expiredNeedingRenew.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No expired memberships waiting for renew
                    </td>
                  </tr>
                ) : (
                  expiredNeedingRenew.map((item) => (
                    <tr key={item.membershipId}>
                      <td>{item.membershipCode}</td>
                      <td>
                        <strong>{item.memberName}</strong>
                        <span>{item.memberCode}</span>
                      </td>
                      <td>{item.planName}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => onNavigate?.('memberships')}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
