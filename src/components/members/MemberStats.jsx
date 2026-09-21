export default function MemberStats({ totalElements, totalPages, activeFilter }) {
  return (
    <section className="stats-grid" aria-label="Member totals">
      <div className="stat">
        <span>Total members</span>
        <strong>{totalElements}</strong>
      </div>
      <div className="stat">
        <span>Visible pages</span>
        <strong>{totalPages}</strong>
      </div>
      <div className="stat">
        <span>Current filter</span>
        <strong>{activeFilter === 'all' ? 'All' : activeFilter}</strong>
      </div>
    </section>
  )
}
