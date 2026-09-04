import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, Settings, Truck as Logo, Book, CalendarDays } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles',    icon: Truck,           label: 'Vehicles' },
  { to: '/bookings',    icon: CalendarDays,    label: 'Bookings' },
  { to: '/drivers',     icon: Users,           label: 'Drivers' },
  { to: '/trips',       icon: Route,           label: 'Trips' },
  { to: '/maintenance', icon: Wrench,          label: 'Maintenance' },
  { to: '/fuel',        icon: Fuel,            label: 'Fuel' },
  { to: '/reports',     icon: BarChart3,       label: 'Reports' },
  { to: '/help',        icon: Book,            label: 'Help' },
  { to: '/settings',    icon: Settings,        label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NK'
  const displayName = user?.name || 'Ntate Khotso'
  const displayEmail = user?.email || 'khotso@fleetpro.ls'

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden" />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white shadow-sm">
            <Logo size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100">FleetPro Lesotho</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Maseru • Lesotho</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}