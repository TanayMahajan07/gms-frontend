export default function MembershipList({
  memberships,
  loading,
  search,
  statusFilter,
  message,
  error,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
  onRenew,
}) {
  function canRenew(status) {
    return status === 'ACTIVE' || status === 'EXPIRED'
  }

  return (
    <section className="panel list-panel">
      <div className="panel-heading">
        <h2>Membership list</h2>
        <button type="button" className="text-button" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="toolbar">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search code, member, plan"
        />
        <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="all">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Member</th>
              <th>Plan</th>
              <th>Dates</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading memberships...
                </td>
              </tr>
            ) : memberships.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No memberships found
                </td>
              </tr>
            ) : (
              memberships.map((item) => (
                <tr key={item.id}>
                  <td>{item.membershipCode}</td>
                  <td>
                    <strong>{item.memberName}</strong>
                    <span>{item.memberCode}</span>
                  </td>
                  <td>{item.planName}</td>
                  <td>
                    <strong>{item.startDate}</strong>
                    <span>to {item.endDate}</span>
                  </td>
                  <td>{Number(item.amount).toFixed(2)}</td>
                  <td>
                    <span
                      className={`status ${
                        item.membershipStatus === 'ACTIVE' ? 'active' : 'inactive'
                      }`}
                    >
                      {item.membershipStatus}
                    </span>
                  </td>
                  <td>
                    {canRenew(item.membershipStatus) ? (
                      <button type="button" className="text-button" onClick={() => onRenew(item)}>
                        Renew
                      </button>
                    ) : (
                      <span>—</span>
                    )}
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
