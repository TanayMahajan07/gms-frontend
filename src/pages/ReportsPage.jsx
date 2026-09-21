import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchReports } from '../api/reportsApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import { navItemsForRole } from '../constants/navigation'
import { formatApiValidationError } from '../utils/validators'

function defaultFrom() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

function defaultTo() {
  return new Date().toISOString().slice(0, 10)
}

export default function ReportsPage({ activeNav = 'reports', onNavigate }) {
  const { auth, logout } = useAuth()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const [appliedFrom, setAppliedFrom] = useState(defaultFrom)
  const [appliedTo, setAppliedTo] = useState(defaultTo)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const queryKey = useMemo(
    () => `${appliedFrom}|${appliedTo}`,
    [appliedFrom, appliedTo],
  )

  const load = useCallback(async () => {
    if (!auth?.accessToken) return
    setLoading(true)
    setError('')
    try {
      const response = await fetchReports({
        accessToken: auth.accessToken,
        from: appliedFrom,
        to: appliedTo,
        onUnauthorized: logout,
      })
      setData(response)
    } catch (err) {
      setError(formatApiValidationError(err))
    } finally {
      setLoading(false)
    }
  }, [auth?.accessToken, appliedFrom, appliedTo, logout])

  useEffect(() => {
    load()
  }, [load, queryKey])

  function handleApply(event) {
    event.preventDefault()
    if (from && to && from > to) {
      setError('From date must be on or before to date')
      return
    }
    setAppliedFrom(from)
    setAppliedTo(to)
  }

  const snapshot = data?.membershipSnapshot
  const byMethod = data?.byMethod ?? []
  const byDay = data?.byDay ?? []
  const outstanding = data?.outstanding ?? []

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Reports"
      eyebrow="Gym Reports"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <form className="panel" style={{ marginBottom: 16 }} onSubmit={handleApply}>
        <div className="panel-heading">
          <h2>Date range</h2>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </div>
        <div className="field-grid">
          <label>
            <span>From</span>
            <input type="date" required value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            <span>To</span>
            <input type="date" required value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
        <p className="login-help">
          Collection uses payment date in range (excludes REFUNDED / CANCELLED). Default = this month
          through today.
        </p>
      </form>

      {error && <div className="notice error">{error}</div>}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="stat">
          <span>Collected ({data?.from || appliedFrom} → {data?.to || appliedTo})</span>
          <strong>
            {loading && !data ? '…' : Number(data?.collectionTotal ?? 0).toFixed(2)}
          </strong>
        </div>
        <div className="stat">
          <span>Outstanding amount</span>
          <strong>
            {loading && !data ? '…' : Number(data?.outstandingTotal ?? 0).toFixed(2)}
          </strong>
        </div>
        <div className="stat">
          <span>Outstanding count</span>
          <strong>{loading && !data ? '…' : (data?.outstandingCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Active memberships</span>
          <strong>{loading && !snapshot ? '…' : (snapshot?.activeCount ?? 0)}</strong>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <div className="stat">
          <span>Expiring soon (≤ {snapshot?.expiryHorizonDays ?? '—'}d)</span>
          <strong>{loading && !snapshot ? '…' : (snapshot?.expiringSoonCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Needs renew</span>
          <strong>{loading && !snapshot ? '…' : (snapshot?.expiredNeedingRenewCount ?? 0)}</strong>
        </div>
        <div className="stat">
          <span>Membership snapshot</span>
          <strong>Live</strong>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 18 }}>
        <section className="panel list-panel">
          <div className="panel-heading">
            <h2>Collection by method</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Count</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {loading && byMethod.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-state">
                      Loading...
                    </td>
                  </tr>
                ) : byMethod.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-state">
                      No collections in range
                    </td>
                  </tr>
                ) : (
                  byMethod.map((row) => (
                    <tr key={row.method}>
                      <td>{row.method}</td>
                      <td>{row.count}</td>
                      <td>{Number(row.total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel list-panel">
          <div className="panel-heading">
            <h2>Collection by day</h2>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Count</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {loading && byDay.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-state">
                      Loading...
                    </td>
                  </tr>
                ) : byDay.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-state">
                      No collections in range
                    </td>
                  </tr>
                ) : (
                  byDay.map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      <td>{row.count}</td>
                      <td>{Number(row.total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel list-panel">
        <div className="panel-heading">
          <h2>Outstanding balances</h2>
          <button
            type="button"
            className="text-button"
            onClick={() => onNavigate?.('payments')}
          >
            Open Payments
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Membership</th>
                <th>Member</th>
                <th>Due</th>
                <th>Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {loading && outstanding.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Loading...
                  </td>
                </tr>
              ) : outstanding.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No outstanding balances
                  </td>
                </tr>
              ) : (
                outstanding.map((item) => (
                  <tr key={item.membershipId}>
                    <td>{item.membershipCode}</td>
                    <td>
                      <strong>{item.memberName}</strong>
                      <span>{item.memberCode}</span>
                    </td>
                    <td>{Number(item.amountDue).toFixed(2)}</td>
                    <td>{Number(item.amountPaid).toFixed(2)}</td>
                    <td>{Number(item.balance).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  )
}
