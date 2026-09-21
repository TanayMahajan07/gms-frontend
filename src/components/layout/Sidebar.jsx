export default function Sidebar({ activeNav = 'members', navItems = [], onNavigate, role }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">G</span>
        <div>
          <strong>GMS MVP</strong>
          <span>{role === 'SUPER_ADMIN' ? 'Platform control' : 'Gym operations'}</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${item.id === activeNav ? ' active' : ''}`}
            disabled={!item.enabled}
            onClick={() => item.enabled && onNavigate?.(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
