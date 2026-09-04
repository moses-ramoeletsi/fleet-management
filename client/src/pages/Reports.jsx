import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import { formatLoti } from '../utils/format'

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']

export default function Reports() {
  const { vehicles, trips, fuel, maintenance } = useFleet()
  const mileageData = vehicles.map(v => ({ name: v.name, mileage: v.mileage }))
  const costData = [{month:'Mar',fuel:18200,maintenance:4800,trips:12400},{month:'Apr',fuel:20500,maintenance:5200,trips:14200},{month:'May',fuel:24800,maintenance:6100,trips:17800},{month:'Jun',fuel:22100,maintenance:4500,trips:15600},{month:'Jul',fuel:28400,maintenance:7200,trips:21400},{month:'Aug',fuel:31200,maintenance:8500,trips:24800}]
  const tripStatus = [{name:'Completed',value:trips.filter(t=>t.status==='completed').length},{name:'In Progress',value:trips.filter(t=>t.status==='in-progress').length},{name:'Scheduled',value:trips.filter(t=>t.status==='scheduled').length}].filter(d=>d.value>0)
  const typeData = vehicles.reduce((a,v)=>{const f=a.find(x=>x.name===v.type);if(f)f.value++;else a.push({name:v.type,value:1});return a},[])
  const totalRevenue = trips.reduce((s,t)=>s+t.cost,0)
  const totalFuelCost = fuel.reduce((s,f)=>s+f.cost,0)
  const totalMaintCost = maintenance.reduce((s,m)=>s+m.cost,0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reports & Analytics</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fleet performance insights</p></div>
        <button className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium text-sm"><Download size={16} /> Export PDF</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SC icon={DollarSign} label="Total Revenue" value={formatLoti(totalRevenue)} color="emerald" />
        <SC icon={TrendingUp} label="Fuel Expenses" value={formatLoti(totalFuelCost)} color="orange" />
        <SC icon={FileText} label="Maintenance Cost" value={formatLoti(totalMaintCost)} color="purple" />
        <SC icon={TrendingUp} label="Net Profit" value={formatLoti(totalRevenue-totalFuelCost-totalMaintCost)} color="brand" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"><h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Monthly Cost Breakdown</h3><ResponsiveContainer width="100%" height={280}><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} /><Tooltip contentStyle={{borderRadius:8,border:'1px solid #334155',background:'#1e293b'}} /><Legend /><Bar dataKey="fuel" stackId="a" fill="#f59e0b" name="Fuel" /><Bar dataKey="maintenance" stackId="a" fill="#8b5cf6" name="Maint." /><Bar dataKey="trips" stackId="a" fill="#3b82f6" name="Revenue" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"><h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Vehicle Mileage</h3>{mileageData.length>0?<ResponsiveContainer width="100%" height={280}><LineChart data={mileageData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={12} /><Tooltip contentStyle={{borderRadius:8,border:'1px solid #334155',background:'#1e293b'}} /><Line type="monotone" dataKey="mileage" stroke="#2563eb" strokeWidth={2.5} dot={{r:5}} /></LineChart></ResponsiveContainer>:<p className="text-center py-12 text-sm text-slate-500">Add vehicles to see mileage data.</p>}</div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"><h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Trip Status</h3>{tripStatus.length>0?<ResponsiveContainer width="100%" height={260}><PieChart><Pie data={tripStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>{tripStatus.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>:<p className="text-center py-12 text-sm text-slate-500">No trip data yet.</p>}</div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"><h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Vehicle Types</h3>{typeData.length>0?<ResponsiveContainer width="100%" height={260}><PieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>{typeData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>:<p className="text-center py-12 text-sm text-slate-500">No vehicle data yet.</p>}</div>
      </div>
    </div>
  )
}

function SC({ icon: Icon, label, value, color }) {
  const cm = {emerald:'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600',orange:'bg-orange-50 dark:bg-orange-900/30 text-orange-600',purple:'bg-purple-50 dark:bg-purple-900/30 text-purple-600',brand:'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}
  return <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p></div><div className={`p-3 rounded-xl ${cm[color]}`}><Icon size={22} /></div></div></div>
}