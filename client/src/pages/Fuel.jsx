import { useState } from 'react'
import { Plus, Trash2, Fuel as FuelIcon, Droplets } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Modal from '../components/Modal'
import { useFleet } from '../context/FleetContext'
import { formatLoti } from '../utils/format'

const emptyForm = { vehicle: '', date: '', liters: 0, cost: 0, location: '' }

export default function FuelPage() {
  const { fuel, vehicles, addFuel, deleteFuel } = useFleet()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const totalLiters = fuel.reduce((s, f) => s + f.liters, 0)
  const totalCost = fuel.reduce((s, f) => s + f.cost, 0)
  const avgCost = fuel.length ? (totalCost / fuel.length).toFixed(2) : 0

  const chartData = fuel.slice().reverse().map(f => ({ vehicle: f.vehicle, liters: f.liters, cost: f.cost }))

  const save = () => { addFuel(form); setModalOpen(false); setForm(emptyForm) }
  const remove = (id) => { if (confirm('Delete this record?')) deleteFuel(id) }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fuel Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor fuel consumption and expenses</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Entries</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{fuel.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><FuelIcon size={22} /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Liters</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalLiters} L</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600"><Droplets size={22} /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Cost</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{formatLoti(totalCost)}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><FuelIcon size={22} /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg per Entry</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{formatLoti(avgCost)}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><FuelIcon size={22} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Consumption Overview</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="vehicle" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Bar dataKey="liters" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Liters" />
            <Bar dataKey="cost" fill="#10b981" radius={[6, 6, 0, 0]} name="Cost ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Fuel Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Liters</th>
                <th className="text-left px-4 py-3 font-semibold">Cost</th>
                <th className="text-left px-4 py-3 font-semibold">Location</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fuel.map(f => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{f.vehicle}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.liters} L</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatLoti(f.cost)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.location}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Fuel Entry">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Vehicle">
            <select value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} className="input">
              <option value="">Select</option>
              {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </F>
          <F label="Date"><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input" /></F>
          <F label="Liters"><input type="number" value={form.liters} onChange={e => setForm({...form, liters: +e.target.value})} className="input" /></F>
          <F label="Cost (M)"><input type="number" value={form.cost} onChange={e => setForm({...form, cost: +e.target.value})} className="input" /></F>
          <F label="Location" full><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input" /></F>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium">Save</button>
        </div>
        <style>{`.input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; outline: none; } .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }`}</style>
      </Modal>
    </div>
  )
}

function F({ label, children, full }) {
  return <div className={full ? 'sm:col-span-2' : ''}><label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>{children}</div>
}