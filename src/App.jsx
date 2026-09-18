import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9092'
const AUTH_STORAGE_KEY = 'gms-auth'

const emptyForm = {
  id: null,
  memberCode: '',
  gymId: 1,
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  mobile: '',
  email: '',
  address: '',
  city: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  joiningDate: new Date().toISOString().slice(0, 10),
  profilePhoto: '',
  active: true,
  remarks: '',
}

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' })
  const [members, setMembers] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 })
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ size: '50', sort: 'id,desc' })
    if (search.trim()) params.set('search', search.trim())
    if (activeFilter !== 'all') params.set('active', activeFilter)
    return params.toString()
  }, [activeFilter, search])

  const request = useCallback(async (path, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...options.headers }
    if (auth?.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      ...options,
    })

    if (response.status === 204) return null

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setAuth(null)
      }
      throw new Error(data?.message ?? 'Request failed')
    }

    return data
  }, [auth?.accessToken])

  const loadMembers = useCallback(async () => {
    if (!auth?.accessToken) return

    setLoading(true)
    setError('')

    try {
      const data = await request(`/api/members?${query}`)
      setMembers(data.content ?? [])
      setPageInfo({
        totalElements: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 0,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [auth?.accessToken, query, request])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers()
  }, [loadMembers])

  async function login(event) {
    event.preventDefault()
    setLoggingIn(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.message ?? 'Login failed')
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
      setAuth(data)
      setMessage(`Signed in as ${data.fullName}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuth(null)
    setMembers([])
    setMessage('')
    setError('')
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function editMember(member) {
    setForm({
      ...emptyForm,
      ...member,
      gender: member.gender ?? '',
      dateOfBirth: member.dateOfBirth ?? '',
      joiningDate: member.joiningDate ?? emptyForm.joiningDate,
      active: member.active ?? true,
    })
    setMessage('')
    setError('')
  }

  function resetForm() {
    setForm(emptyForm)
    setMessage('')
    setError('')
  }

  async function saveMember(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const payload = {
      ...form,
      gymId: form.gymId ? Number(form.gymId) : null,
      gender: form.gender || null,
      dateOfBirth: form.dateOfBirth || null,
      memberCode: form.memberCode || null,
      profilePhoto: form.profilePhoto || null,
    }

    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt

    try {
      if (form.id) {
        await request(`/api/members/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setMessage('Member updated')
      } else {
        await request('/api/members', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Member created')
      }

      resetForm()
      await loadMembers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function setMemberStatus(member, active) {
    setError('')
    setMessage('')

    try {
      await request(`/api/members/${member.id}/status?active=${active}`, {
        method: 'PATCH',
      })
      setMessage(`${member.firstName} ${active ? 'activated' : 'deactivated'}`)
      await loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!auth?.accessToken) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div>
            <p className="eyebrow">GMS MVP</p>
            <h1>Sign in</h1>
          </div>

          <form onSubmit={login} className="login-form">
            <label>
              <span>Username</span>
              <input
                value={loginForm.username}
                onChange={(e) => setLoginForm((current) => ({ ...current, username: e.target.value }))}
                autoComplete="username"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((current) => ({ ...current, password: e.target.value }))}
                autoComplete="current-password"
                required
              />
            </label>

            {error && <div className="notice error">{error}</div>}

            <button type="submit" className="primary-button" disabled={loggingIn}>
              {loggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="login-help">Default dev login: admin / admin123</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">G</span>
          <div>
            <strong>GMS MVP</strong>
            <span>Gym operations</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <button type="button" className="nav-item active">Members</button>
          <button type="button" className="nav-item" disabled>Plans</button>
          <button type="button" className="nav-item" disabled>Memberships</button>
          <button type="button" className="nav-item" disabled>Payments</button>
          <button type="button" className="nav-item" disabled>Reports</button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Member Management</p>
            <h1>Members</h1>
          </div>
          <div className="topbar-actions">
            <div className="api-chip">{auth.fullName} · {auth.role}</div>
            <button type="button" className="text-button" onClick={logout}>Logout</button>
          </div>
        </header>

        <section className="stats-grid" aria-label="Member totals">
          <div className="stat">
            <span>Total members</span>
            <strong>{pageInfo.totalElements}</strong>
          </div>
          <div className="stat">
            <span>Visible pages</span>
            <strong>{pageInfo.totalPages}</strong>
          </div>
          <div className="stat">
            <span>Current filter</span>
            <strong>{activeFilter === 'all' ? 'All' : activeFilter}</strong>
          </div>
        </section>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading">
              <h2>{form.id ? 'Edit member' : 'Add member'}</h2>
              {form.id && (
                <button type="button" className="text-button" onClick={resetForm}>
                  Clear
                </button>
              )}
            </div>

            <form onSubmit={saveMember} className="member-form">
              <div className="field-grid">
                <label>
                  <span>Member code</span>
                  <input value={form.memberCode} onChange={(e) => updateField('memberCode', e.target.value)} placeholder="Auto if blank" />
                </label>
                <label>
                  <span>Gym ID</span>
                  <input type="number" value={form.gymId} onChange={(e) => updateField('gymId', e.target.value)} />
                </label>
                <label>
                  <span>First name</span>
                  <input required value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                </label>
                <label>
                  <span>Last name</span>
                  <input required value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                </label>
                <label>
                  <span>Gender</span>
                  <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label>
                  <span>Date of birth</span>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
                </label>
                <label>
                  <span>Mobile</span>
                  <input value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                </label>
                <label>
                  <span>City</span>
                  <input value={form.city} onChange={(e) => updateField('city', e.target.value)} />
                </label>
                <label>
                  <span>Joining date</span>
                  <input required type="date" value={form.joiningDate} onChange={(e) => updateField('joiningDate', e.target.value)} />
                </label>
              </div>

              <label>
                <span>Address</span>
                <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} rows="2" />
              </label>

              <div className="field-grid">
                <label>
                  <span>Emergency contact</span>
                  <input value={form.emergencyContactName} onChange={(e) => updateField('emergencyContactName', e.target.value)} />
                </label>
                <label>
                  <span>Emergency number</span>
                  <input value={form.emergencyContactNumber} onChange={(e) => updateField('emergencyContactNumber', e.target.value)} />
                </label>
              </div>

              <label>
                <span>Remarks</span>
                <textarea value={form.remarks} onChange={(e) => updateField('remarks', e.target.value)} rows="2" />
              </label>

              <label className="checkbox-row">
                <input type="checkbox" checked={form.active} onChange={(e) => updateField('active', e.target.checked)} />
                <span>Active member</span>
              </label>

              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? 'Saving...' : form.id ? 'Update member' : 'Create member'}
              </button>
            </form>
          </section>

          <section className="panel list-panel">
            <div className="panel-heading">
              <h2>Member list</h2>
              <button type="button" className="text-button" onClick={loadMembers} disabled={loading}>
                Refresh
              </button>
            </div>

            <div className="toolbar">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, code, mobile, email" />
              <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
                <option value="all">All status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {message && <div className="notice success">{message}</div>}
            {error && <div className="notice error">{error}</div>}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="empty-state">Loading members...</td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">No members found</td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id}>
                        <td>{member.memberCode}</td>
                        <td>
                          <strong>{member.firstName} {member.lastName}</strong>
                          <span>{member.email || 'No email'}</span>
                        </td>
                        <td>{member.mobile || '-'}</td>
                        <td>{member.joiningDate}</td>
                        <td>
                          <span className={`status ${member.active ? 'active' : 'inactive'}`}>
                            {member.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button type="button" onClick={() => editMember(member)}>Edit</button>
                            <button type="button" onClick={() => setMemberStatus(member, !member.active)}>
                              {member.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default App
