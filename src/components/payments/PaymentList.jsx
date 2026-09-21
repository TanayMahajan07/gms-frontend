export default function PaymentList({
  payments,
  loading,
  search,
  statusFilter,
  message,
  error,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
}) {
  return (
    <section className="panel list-panel">
      <div className="panel-heading">
        <h2>Payment list</h2>
        <button type="button" className="text-button" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="toolbar">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search receipt, member, membership"
        />
        <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="all">All status</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
          <option value="REFUNDED">Refunded</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Receipt</th>
              <th>Member</th>
              <th>Membership</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading payments...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((item) => (
                <tr key={item.id}>
                  <td>{item.paymentReference}</td>
                  <td>
                    <strong>{item.memberName}</strong>
                    <span>{item.memberCode}</span>
                  </td>
                  <td>{item.membershipCode}</td>
                  <td>{Number(item.amount).toFixed(2)}</td>
                  <td>{item.paymentDate}</td>
                  <td>{item.paymentMethod}</td>
                  <td>
                    <span
                      className={`status ${
                        item.paymentStatus === 'PAID' ? 'active' : 'inactive'
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
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
