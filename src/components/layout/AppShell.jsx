import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({
  auth,
  onLogout,
  title,
  eyebrow,
  activeNav = 'members',
  navItems,
  onNavigate,
  children,
}) {
  return (
    <main className="app-shell">
      <Sidebar
        activeNav={activeNav}
        navItems={navItems}
        onNavigate={onNavigate}
        role={auth?.role}
      />
      <section className="workspace">
        <Topbar title={title} eyebrow={eyebrow} auth={auth} onLogout={onLogout} />
        {children}
      </section>
    </main>
  )
}
