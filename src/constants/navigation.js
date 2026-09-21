export function navItemsForRole(role) {
  if (role === 'SUPER_ADMIN') {
    return [
      { id: 'create-gym', label: 'Create Gym & Admin', enabled: true },
    ]
  }

  return [
    { id: 'dashboard', label: 'Dashboard', enabled: true },
    { id: 'members', label: 'Members', enabled: true },
    { id: 'plans', label: 'Plans', enabled: true },
    { id: 'memberships', label: 'Memberships', enabled: true },
    { id: 'payments', label: 'Payments', enabled: true },
    { id: 'reports', label: 'Reports', enabled: true },
    { id: 'profile', label: 'My Profile', enabled: true },
    { id: 'gym-settings', label: 'Gym Settings', enabled: true },
  ]
}

export function defaultViewForRole(role) {
  return role === 'SUPER_ADMIN' ? 'create-gym' : 'dashboard'
}
