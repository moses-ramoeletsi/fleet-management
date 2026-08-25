import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Fuel, MapPin } from 'lucide-react'
import Modal from '../components/Modal'
import { useFleet } from '../context/FleetContext'

const emptyForm = { name: '', plate: '', type: 'Heavy Truck', status: 'active', driver: '', fuel: 0, mileage: 0, lastService: '', location: '' }

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, drivers } = useFleet()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const filtered = vehicles.filter(v =>
    (filterStatus === 'all' || v.status === filterStatus) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (v) => { setForm(v); setEditId(v.id); setModalOpen(true) }
  const save = () => {
    if (editId) updateVehicle(form)
    else addVehicle(form)
    setModalOpen(false)
  }
  const remove = (id) => { if (confirm('Delete this vehicle?')) deleteVehicle(id) }

  const statusColor = {
    active: 'bg-emerald-50 text-emerald-700',
    idle: 'bg-amber-50 text-amber-700',
    maintenance: 'bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your fleet vehicles</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 flex-1">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or plate..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Driver</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Fuel</th>
                <th className="text-left px-4 py-3 font-semibold">Mileage</th>
                <th className="text-left px-4 py-3 font-semibold">Location</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{v.name}</p>
                    <p className="text-xs text-slate-500">{v.plate}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{v.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{v.driver}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${v.fuel < 30 ? 'bg-red-500' : v.fuel < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${v.fuel}%` }} />
                      </div>
                      <span className="text-xs text-slate-600">{v.fuel}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{v.mileage.toLocaleString()} km</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin size={14} /> {v.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><Edit2 size={16} /></button>
                    <button onClick={() => remove(v.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 ml-1"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500">No vehicles found.</div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Vehicle' : 'Add Vehicle'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name"><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" /></Field>
          <Field label="Plate Number"><input value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} className="input" /></Field>
          <Field label="Type">
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input">
              <option>Heavy Truck</option><option>Delivery Van</option><option>Sedan</option><option>SUV</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
              <option value="active">Active</option><option value="idle">Idle</option><option value="maintenance">Maintenance</option>
            </select>
          </Field>
          <Field label="Driver">
            <select value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} className="input">
              <option value="">Select driver</option>
              {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Location"><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input" /></Field>
          <Field label="Fuel Level (%)"><input type="number" min="0" max="100" value={form.fuel} onChange={e => setForm({...form, fuel: +e.target.value})} className="input" /></Field>
          <Field label="Mileage (km)"><input type="number" value={form.mileage} onChange={e => setForm({...form, mileage: +e.target.value})} className="input" /></Field>
          <Field label="Last Service" full><input type="date" value={form.lastService} onChange={e => setForm({...form, lastService: e.target.value})} className="input" /></Field>
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

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}