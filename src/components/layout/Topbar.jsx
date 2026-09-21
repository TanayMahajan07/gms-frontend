export default function Topbar({ title, eyebrow, auth, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="api-chip">
          {auth.fullName} · {auth.role}
        </div>
        <button type="button" className="text-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
