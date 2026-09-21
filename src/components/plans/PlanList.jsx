export default function PlanList({
  plans,
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
        <h2>Plan list</h2>
        <button type="button" className="text-button" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="toolbar">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search plan name or description"
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
              <th>Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  Loading plans...
                </td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No plans found
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <strong>{plan.planName}</strong>
                    <span>{plan.description || 'No description'}</span>
                  </td>
                  <td>
                    {plan.duration} {plan.durationUnit}
                  </td>
                  <td>{Number(plan.price).toFixed(2)}</td>
                  <td>
                    <span className={`status ${plan.active ? 'active' : 'inactive'}`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" onClick={() => onEdit(plan)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => onToggleStatus(plan)}>
                        {plan.active ? 'Deactivate' : 'Activate'}
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
