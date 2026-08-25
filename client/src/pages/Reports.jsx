import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import { formatLoti } from '../utils/format'
    
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Reports() {
  const { vehicles, trips, fuel, maintenance } = useFleet()

  // Vehicle mileage
  const mileageData = vehicles.map(v => ({ name: v.name, mileage: v.mileage }))

  // Monthly cost breakdown
  const costData = [
    { month: 'Mar', fuel: 3200, maintenance: 1800, trips: 4200 },
    { month: 'Apr', fuel: 3800, maintenance: 2100, trips: 5500 },
    { month: 'May', fuel: 3500, maintenance: 1500, trips: 4800 },
    { month: 'Jun', fuel: 4100, maintenance: 2400, trips: 6200 },
    { month: 'Jul', fuel: 4600, maintenance: 1900, trips: 7100 },
    { month: 'Aug', fuel: 4400, maintenance: 2200, trips: 6800 },
  ]

  // Trip status distribution
  const tripStatus = [
    { name: 'Completed', value: trips.filter(t => t.status === 'completed').length },
    { name: 'In Progress', value: trips.filter(t => t.status === 'in-progress').length },
    { name: 'Scheduled', value: trips.filter(t => t.status === 'scheduled').length },
  ]

  // Vehicle type distribution
  const typeData = vehicles.reduce((acc, v) => {
    const found = acc.find(x => x.name === v.type)
    if (found) found.value++
    else acc.push({ name: v.type, value: 1 })
    return acc
  }, [])

  const totalRevenue = trips.reduce((s, t) => s + t.cost, 0)
  const totalFuelCost = fuel.reduce((s, f) => s + f.cost, 0)
  const totalMaintCost = maintenance.reduce((s, m) => s + m.cost, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Comprehensive fleet performance insights</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={DollarSign} label="Total Revenue" value={formatLoti(totalRevenue)} color="emerald" />
        <SummaryCard icon={TrendingUp} label="Fuel Expenses" value={formatLoti(totalFuelCost)} color="orange" />
        <SummaryCard icon={FileText} label="Maintenance Cost" value={formatLoti(totalMaintCost)} color="purple" />
        <SummaryCard icon={TrendingUp} label="Net Profit" value={formatLoti(totalRevenue - totalFuelCost - totalMaintCost)} color="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Monthly Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="fuel" stackId="a" fill="#f59e0b" name="Fuel" />
              <Bar dataKey="maintenance" stackId="a" fill="#8b5cf6" name="Maintenance" />
              <Bar dataKey="trips" stackId="a" fill="#3b82f6" name="Trips Revenue" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Vehicle Mileage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mileageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="mileage" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Trip Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={tripStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                {tripStatus.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Vehicle Types</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {typeData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    brand: 'bg-blue-50 text-blue-600',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}><Icon size={22} /></div>
      </div>
    </div>
  )
}