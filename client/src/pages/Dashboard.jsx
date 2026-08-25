import { Truck, Users, Route, Fuel, AlertTriangle, DollarSign } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import { useFleet } from '../context/FleetContext'
import {formatLoti} from '../utils/format'

const monthlyData = [
  { month: 'Mar', trips: 42, fuel: 3200 },
  { month: 'Apr', trips: 55, fuel: 3800 },
  { month: 'May', trips: 48, fuel: 3500 },
  { month: 'Jun', trips: 62, fuel: 4100 },
  { month: 'Jul', trips: 71, fuel: 4600 },
  { month: 'Aug', trips: 68, fuel: 4400 },
]

const vehicleStatusData = [
  { name: 'Active', value: 4, color: '#10b981' },
  { name: 'Idle', value: 1, color: '#f59e0b' },
  { name: 'Maintenance', value: 1, color: '#ef4444' },
]

export default function Dashboard() {
  const { vehicles, drivers, trips, fuel } = useFleet()

  const totalFuelCost = fuel.reduce((s, f) => s + f.cost, 0)
  const totalTripCost = trips.reduce((s, t) => s + t.cost, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here's your fleet overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Truck} label="Total Vehicles" value={vehicles.length} change={8} color="brand" />
        <StatCard icon={Users} label="Active Drivers" value={drivers.filter(d => d.status === 'active').length} change={4} color="green" />
        <StatCard icon={Route} label="Active Trips" value={trips.filter(t => t.status === 'in-progress').length} change={12} color="purple" />
        <StatCard icon={Fuel} label="Avg Fuel Level" value={`${Math.round(vehicles.reduce((s,v)=>s+v.fuel,0)/vehicles.length)}%`} change={-3} color="orange" />
        <StatCard icon={DollarSign} label="Trip Revenue" value={formatLoti(totalTripCost)} change={15} color="green" />
        <StatCard icon={AlertTriangle} label="Pending Maint." value={3} change={-10} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Trips & Fuel Trend</h3>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line type="monotone" dataKey="trips" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="fuel" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Vehicle Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={vehicleStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {vehicleStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {vehicleStatusData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {trips.slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Route size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t.from} → {t.to}</p>
                    <p className="text-xs text-slate-500">{t.driver} • {t.date}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  t.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                  t.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Fuel Consumption</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fuel.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="vehicle" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="liters" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}