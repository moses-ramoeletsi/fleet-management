import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Star, Phone, Mail } from 'lucide-react'
import Modal from '../components/Modal'
import { useFleet } from '../context/FleetContext'

const emptyForm = { name: '', license: '', phone: '', email: '', status: 'active', trips: 0, rating: 5, vehicle: '' }

export default function Drivers() {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver } = useFleet()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (d) => { setForm(d); setEditId(d.id); setModalOpen(true) }
  const save = () => {
    if (editId) updateDriver(form); else addDriver(form)
    setModalOpen(false)
  }
  const remove = (id) => { if (confirm('Delete this driver?')) deleteDriver(id) }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Drivers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your driver team</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md">
        <Search size={16} className="text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..." className="bg-transparent outline-none text-sm flex-1" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {d.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{d.name}</h3>
                  <p className="text-xs text-slate-500">{d.license}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                d.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>{d.status}</span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Phone size={14} /> {d.phone}</div>
              <div className="flex items-center gap-2 text-slate-600"><Mail size={14} /> {d.email}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-slate-800">{d.trips}</p>
                <p className="text-xs text-slate-500">Trips</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-lg font-bold text-slate-800">{d.rating}</span>
                </div>
                <p className="text-xs text-slate-500">Rating</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 truncate">{d.vehicle}</p>
                <p className="text-xs text-slate-500">Vehicle</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(d)} className="flex-1 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700">Edit</button>
              <button onClick={() => remove(d.id)} className="flex-1 py-1.5 text-sm rounded-lg border border-red-200 hover:bg-red-50 font-medium text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Driver' : 'Add Driver'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Full Name"><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" /></F>
          <F label="License Number"><input value={form.license} onChange={e => setForm({...form, license: e.target.value})} className="input" /></F>
          <F label="Phone"><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" /></F>
          <F label="Email"><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" /></F>
          <F label="Status">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
              <option value="active">Active</option><option value="on-leave">On Leave</option>
            </select>
          </F>
          <F label="Assigned Vehicle">
            <select value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} className="input">
              <option value="">Select vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </F>
          <F label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: +e.target.value})} className="input" /></F>
          <F label="Total Trips"><input type="number" value={form.trips} onChange={e => setForm({...form, trips: +e.target.value})} className="input" /></F>
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