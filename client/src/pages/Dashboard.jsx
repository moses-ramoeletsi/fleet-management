import { Truck, Users, Route, Fuel, AlertTriangle, DollarSign, Link } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import EmptyState from '../components/EmptyState'
import { useFleet } from '../context/FleetContext'
import { formatLoti } from '../utils/format'

export default function Dashboard() {
  const { vehicles, drivers, trips, fuel } = useFleet()

  if (vehicles.length === 0 && drivers.length === 0) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to FleetPro Lesotho</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Let's get your fleet set up</p></div>
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-xl border border-brand-200 dark:border-brand-800 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-600 flex items-center justify-center text-white mb-4"><Truck size={36} /></div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your Fleet Dashboard is Ready</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">Start by adding your vehicles and drivers. Once added, you'll see real-time analytics, fuel tracking, and trip management here.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <QuickAction to="/vehicles" icon={Truck} label="Add Vehicles" desc="Register your fleet" />
            <QuickAction to="/drivers" icon={Users} label="Add Drivers" desc="Assign your team" />
            <QuickAction to="/bookings" icon={Route} label="Book Vehicles" desc="Manage requests" />
          </div>
        </div>
      </div>
    )
  }

  const totalFuelCost = fuel.reduce((s, f) => s + f.cost, 0)
  const totalTripCost = trips.reduce((s, t) => s + t.cost, 0)
  const activeCount = vehicles.filter(v => v.status === 'active').length
  const idleCount = vehicles.filter(v => v.status === 'idle').length
  const maintCount = vehicles.filter(v => v.status === 'maintenance').length

  const vehicleStatusData = [
    { name: 'Active', value: activeCount, color: '#10b981' },
    { name: 'Idle', value: idleCount, color: '#f59e0b' },
    { name: 'Maintenance', value: maintCount, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const monthlyData = [
    { month: 'Mar', trips: 38, fuel: 18200 }, { month: 'Apr', trips: 42, fuel: 20500 },
    { month: 'May', trips: 55, fuel: 24800 }, { month: 'Jun', trips: 48, fuel: 22100 },
    { month: 'Jul', trips: 62, fuel: 28400 }, { month: 'Aug', trips: 71, fuel: 31200 },
  ]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your fleet overview.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Truck} label="Total Vehicles" value={vehicles.length} change={8} color="brand" />
        <StatCard icon={Users} label="Active Drivers" value={drivers.filter(d => d.status === 'active').length} change={4} color="green" />
        <StatCard icon={Route} label="Active Trips" value={trips.filter(t => t.status === 'in-progress').length} change={12} color="purple" />
        <StatCard icon={Fuel} label="Avg Fuel" value={`${vehicles.length ? Math.round(vehicles.reduce((s,v)=>s+v.fuel,0)/vehicles.length) : 0}%`} change={-3} color="orange" />
        <StatCard icon={DollarSign} label="Trip Revenue" value={formatLoti(totalTripCost)} change={15} color="green" />
        <StatCard icon={AlertTriangle} label="Pending Maint." value={3} change={-10} color="red" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Trips & Fuel Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} /><Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #334155', background: '#1e293b' }} /><Legend /><Line type="monotone" dataKey="trips" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} /><Line type="monotone" dataKey="fuel" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Vehicle Status</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={vehicleStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">{vehicleStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          <div className="space-y-2 mt-2">{vehicleStatusData.map(s => (<div key={s.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: s.color }} /><span className="text-slate-600 dark:text-slate-300">{s.name}</span></div><span className="font-semibold text-slate-800 dark:text-slate-100">{s.value}</span></div>))}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent Trips</h3>
          <div className="space-y-3">{trips.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center"><Route size={18} /></div><div><p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.from} → {t.to}</p><p className="text-xs text-slate-500">{t.driver} • {t.date}</p></div></div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : t.status === 'in-progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>{t.status}</span>
            </div>
          ))}</div>
          {trips.length === 0 && <EmptyState icon={Route} title="No trips yet" description="Add your first trip to see activity here." />}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Fuel Consumption</h3>
          {fuel.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}><BarChart data={fuel.slice(0, 5)}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="vehicle" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={12} /><Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #334155', background: '#1e293b' }} /><Bar dataKey="liters" fill="#3b82f6" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer>
          ) : <EmptyState icon={Fuel} title="No fuel data" description="Log fuel entries to see consumption trends." />}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon: Icon, label, desc }) {
  return (
    <RouterLink to={to} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:shadow-md transition-all text-left">
      <Icon size={22} className="text-brand-600 mb-2" /><p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{label}</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
    </RouterLink>
  )
}