import { useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { defaultViewForRole } from './constants/navigation'
import CreateGymAdminPage from './pages/CreateGymAdminPage'
import DashboardPage from './pages/DashboardPage'
import GymSettingsPage from './pages/GymSettingsPage'
import LoginPage from './pages/LoginPage'
import MembersPage from './pages/MembersPage'
import MembershipsPage from './pages/MembershipsPage'
import PaymentsPage from './pages/PaymentsPage'
import PlansPage from './pages/PlansPage'
import ProfilePage from './pages/ProfilePage'
import ReportsPage from './pages/ReportsPage'
import './styles/App.css'

function App() {
  const { isAuthenticated, auth } = useAuth()
  const [activeView, setActiveView] = useState(() => defaultViewForRole(auth?.role))

  useEffect(() => {
    if (auth?.role) {
      setActiveView(defaultViewForRole(auth.role))
    }
  }, [auth?.role, auth?.userId])

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (auth.role === 'SUPER_ADMIN') {
    return (
      <CreateGymAdminPage
        activeNav={activeView}
        onNavigate={setActiveView}
      />
    )
  }

  if (activeView === 'dashboard') {
    return <DashboardPage activeNav={activeView} onNavigate={setActiveView} />
  }

  if (activeView === 'profile') {
    return <ProfilePage activeNav={activeView} onNavigate={setActiveView} />
  }

  if (activeView === 'gym-settings') {
    return <GymSettingsPage activeNav={activeView} onNavigate={setActiveView} />
  }

  if (activeView === 'plans') {
    return <PlansPage activeNav={activeView} onNavigate={setActiveView} />
  }

  if (activeView === 'memberships') {
    return <MembershipsPage activeNav={activeView} onNavigate={setActiveView} />
  }

  if (activeView === 'payments') {
    return <PaymentsPage activeNav={activeView} onNavigate={setActiveView} />
  }

  if (activeView === 'reports') {
    return <ReportsPage activeNav={activeView} onNavigate={setActiveView} />
  }

  return <MembersPage activeNav={activeView} onNavigate={setActiveView} />
}

export default App
