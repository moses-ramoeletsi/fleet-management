import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react'
import Modal from '../components/Modal'
import { useFleet } from '../context/FleetContext'
import { formatLoti } from '../utils/format'

const emptyForm = { driver: '', vehicle: '', from: '', to: '', status: 'scheduled', date: '', distance: 0, cost: 0 }

export default function Trips() {
  const { trips, drivers, vehicles, addTrip, updateTrip, deleteTrip } = useFleet()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const filtered = trips.filter(t =>
    (filterStatus === 'all' || t.status === filterStatus) &&
    (t.driver.toLowerCase().includes(search.toLowerCase()) || t.from.toLowerCase().includes(search.toLowerCase()) || t.to.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (t) => { setForm(t); setEditId(t.id); setModalOpen(true) }
  const save = () => {
    if (editId) updateTrip(form); else addTrip(form)
    setModalOpen(false)
  }
  const remove = (id) => { if (confirm('Delete this trip?')) deleteTrip(id) }

  const statusColor = {
    'completed': 'bg-emerald-50 text-emerald-700',
    'in-progress': 'bg-blue-50 text-blue-700',
    'scheduled': 'bg-slate-100 text-slate-700',
    'cancelled': 'bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trips</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage all trips</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Plus size={16} /> New Trip
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-1">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trips..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Route</th>
                <th className="text-left px-4 py-3 font-semibold">Driver</th>
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Distance</th>
                <th className="text-left px-4 py-3 font-semibold">Cost</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-brand-600" />
                      <span className="font-medium text-slate-800">{t.from}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-medium text-slate-800">{t.to}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.driver}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.vehicle}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.distance} km</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatLoti(t.cost)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><Edit2 size={16} /></button>
                    <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 ml-1"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-sm text-slate-500">No trips found.</div>}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Trip' : 'New Trip'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Driver">
            <select value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} className="input">
              <option value="">Select</option>
              {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </F>
          <F label="Vehicle">
            <select value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} className="input">
              <option value="">Select</option>
              {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </F>
          <F label="From"><input value={form.from} onChange={e => setForm({...form, from: e.target.value})} className="input" /></F>
          <F label="To"><input value={form.to} onChange={e => setForm({...form, to: e.target.value})} className="input" /></F>
          <F label="Date"><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input" /></F>
          <F label="Status">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </F>
          <F label="Distance (km)"><input type="number" value={form.distance} onChange={e => setForm({...form, distance: +e.target.value})} className="input" /></F>
          <F label="Cost (M)"><input type="number" value={form.cost} onChange={e => setForm({...form, cost: +e.target.value})} className="input" /></F>
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

function F({ label, children }) {
  return <div><label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>{children}</div>
}