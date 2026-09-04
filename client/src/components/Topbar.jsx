import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Search, LogOut } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onMenuClick }) {
  const { notifications, markNotificationRead } = useFleet()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showNotif, setShowNotif] = useState(false)
  const ref = useRef()
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Menu size={20} /></button>
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 w-80">
          <Search size={16} className="text-slate-400" />
          <input placeholder="Search vehicles, drivers, trips..." className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-400 text-slate-800 dark:text-slate-100" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="relative" ref={ref}>
          <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100">Notifications</div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${!n.read ? 'bg-brand-50/40 dark:bg-brand-900/20' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => { logout(); navigate('/login') }} title="Sign out" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}