import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createMember,
  fetchMembers,
  updateMember,
  updateMemberStatus,
} from '../api/membersApi'
import { useAuth } from '../auth/AuthContext'
import AppShell from '../components/layout/AppShell'
import MemberForm from '../components/members/MemberForm'
import MemberList from '../components/members/MemberList'
import MemberStats from '../components/members/MemberStats'
import { emptyMemberForm, toMemberPayload } from '../constants/memberForm'
import { navItemsForRole } from '../constants/navigation'

export default function MembersPage({ activeNav = 'members', onNavigate }) {
  const { auth, logout } = useAuth()
  const [members, setMembers] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 })
  const [form, setForm] = useState(emptyMemberForm)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ size: '50', sort: 'id,desc' })
    if (search.trim()) params.set('search', search.trim())
    if (activeFilter !== 'all') params.set('active', activeFilter)
    return params.toString()
  }, [activeFilter, search])

  const loadMembers = useCallback(async () => {
    if (!auth?.accessToken) return

    setLoading(true)
    setError('')

    try {
      const data = await fetchMembers({
        accessToken: auth.accessToken,
        query,
        onUnauthorized: logout,
      })
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
  }, [auth?.accessToken, logout, query])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers()
  }, [loadMembers])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function editMember(member) {
    setForm({
      ...emptyMemberForm,
      id: member.id,
      firstName: member.firstName ?? '',
      lastName: member.lastName ?? '',
      gender: member.gender ?? '',
      dateOfBirth: member.dateOfBirth ?? '',
      mobile: member.mobile ?? '',
      email: member.email ?? '',
      address: member.address ?? '',
      city: member.city ?? '',
      emergencyContactName: member.emergencyContactName ?? '',
      emergencyContactNumber: member.emergencyContactNumber ?? '',
      joiningDate: member.joiningDate ?? emptyMemberForm.joiningDate,
      profilePhoto: member.profilePhoto ?? '',
      active: member.active ?? true,
      remarks: member.remarks ?? '',
    })
    setMessage('')
    setError('')
  }

  function resetForm() {
    setForm(emptyMemberForm)
    setMessage('')
    setError('')
  }

  async function saveMember(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const payload = toMemberPayload(form)

    try {
      if (form.id) {
        await updateMember({
          accessToken: auth.accessToken,
          id: form.id,
          payload,
          onUnauthorized: logout,
        })
        setMessage('Member updated')
      } else {
        await createMember({
          accessToken: auth.accessToken,
          payload,
          onUnauthorized: logout,
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

  async function setMemberStatus(member) {
    setError('')
    setMessage('')

    try {
      await updateMemberStatus({
        accessToken: auth.accessToken,
        id: member.id,
        active: !member.active,
        onUnauthorized: logout,
      })
      setMessage(`${member.firstName} ${!member.active ? 'activated' : 'deactivated'}`)
      await loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AppShell
      auth={auth}
      onLogout={logout}
      title="Members"
      eyebrow="Member Management"
      activeNav={activeNav}
      navItems={navItemsForRole(auth.role)}
      onNavigate={onNavigate}
    >
      <MemberStats
        totalElements={pageInfo.totalElements}
        totalPages={pageInfo.totalPages}
        activeFilter={activeFilter}
      />

      <div className="content-grid">
        <MemberForm
          form={form}
          saving={saving}
          onChange={updateField}
          onSubmit={saveMember}
          onClear={resetForm}
        />
        <MemberList
          members={members}
          loading={loading}
          search={search}
          activeFilter={activeFilter}
          message={message}
          error={error}
          onSearchChange={setSearch}
          onActiveFilterChange={setActiveFilter}
          onRefresh={loadMembers}
          onEdit={editMember}
          onToggleStatus={setMemberStatus}
        />
      </div>
    </AppShell>
  )
}
