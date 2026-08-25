import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Wrench } from 'lucide-react'
import Modal from '../components/Modal'
import { useFleet } from '../context/FleetContext'
import { formatLoti } from '../utils/format'

const emptyForm = { vehicle: '', type: '', date: '', status: 'scheduled', cost: 0, mechanic: '' }

export default function Maintenance() {
  const { maintenance, vehicles, addMaintenance, updateMaintenance, deleteMaintenance } = useFleet()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const filtered = maintenance.filter(m =>
    (filterStatus === 'all' || m.status === filterStatus) &&
    (m.vehicle.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase()))
  )

  const totalCost = maintenance.reduce((s, m) => s + m.cost, 0)

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (m) => { setForm(m); setEditId(m.id); setModalOpen(true) }
  const save = () => {
    if (editId) updateMaintenance(form); else addMaintenance(form)
    setModalOpen(false)
  }
  const remove = (id) => { if (confirm('Delete this record?')) deleteMaintenance(id) }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-sm text-slate-500 mt-1">Schedule and track vehicle maintenance</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Plus size={16} /> Add Record
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Records</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{maintenance.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Scheduled</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{maintenance.filter(m => m.status === 'scheduled').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Cost</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatLoti(totalCost)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-1">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Mechanic</th>
                <th className="text-left px-4 py-3 font-semibold">Cost</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Wrench size={14} /></div>
                      <span className="font-medium text-slate-800">{m.vehicle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{m.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{m.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{m.mechanic}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatLoti(m.cost)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      m.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><Edit2 size={16} /></button>
                    <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 ml-1"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-sm text-slate-500">No records found.</div>}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Record' : 'Add Maintenance'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Vehicle">
            <select value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} className="input">
              <option value="">Select</option>
              {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </F>
          <F label="Type"><input value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input" placeholder="e.g. Oil Change" /></F>
          <F label="Date"><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input" /></F>
          <F label="Status">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
              <option value="scheduled">Scheduled</option><option value="completed">Completed</option>
            </select>
          </F>
          <F label="Cost (M)"><input type="number" value={form.cost} onChange={e => setForm({...form, cost: +e.target.value})} className="input" /></F>
          <F label="Mechanic"><input value={form.mechanic} onChange={e => setForm({...form, mechanic: e.target.value})} className="input" /></F>
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