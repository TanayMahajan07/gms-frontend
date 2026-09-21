export default function MemberList({
  members,
  loading,
  search,
  activeFilter,
  message,
  error,
  onSearchChange,
  onActiveFilterChange,
  onRefresh,
  onEdit,
  onToggleStatus,
}) {
  return (
    <section className="panel list-panel">
      <div className="panel-heading">
        <h2>Member list</h2>
        <button type="button" className="text-button" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="toolbar">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, code, mobile, email"
        />
        <select value={activeFilter} onChange={(e) => onActiveFilterChange(e.target.value)}>
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
                <td colSpan="6" className="empty-state">
                  Loading members...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id}>
                  <td>{member.memberCode}</td>
                  <td>
                    <strong>
                      {member.firstName} {member.lastName}
                    </strong>
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
                      <button type="button" onClick={() => onEdit(member)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => onToggleStatus(member)}>
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
  )
}
