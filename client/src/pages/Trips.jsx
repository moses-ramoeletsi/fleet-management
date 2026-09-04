import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, MapPin, Route, AlertTriangle } from 'lucide-react'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { validateRequiredFields } from '../utils/validation'
import { formatLoti } from '../utils/format'

const emptyForm = { driver: '', vehicle: '', from: '', to: '', status: 'scheduled', date: '', distance: 0, cost: 0 }

export default function Trips() {
  const { trips, drivers, vehicles, addTrip, updateTrip, deleteTrip, isVehicleAvailableForTrip, getVehicleAvailability } = useFleet()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [vehicleWarning, setVehicleWarning] = useState('')

  const filtered = trips.filter(t => (filterStatus === 'all' || t.status === filterStatus) && (t.driver.toLowerCase().includes(search.toLowerCase()) || t.from.toLowerCase().includes(search.toLowerCase())))
  
  const openAdd = () => { 
    setForm(emptyForm)
    setEditId(null)
    setVehicleWarning('')
    setModalOpen(true) 
  }
  
  const openEdit = (t) => { 
    setForm(t)
    setEditId(t.id)
    setVehicleWarning('')
    setModalOpen(true) 
  }
  
  const handleVehicleChange = (vehicleName) => {
    setForm({...form, vehicle: vehicleName})
    
    if (!vehicleName) {
      setVehicleWarning('')
      return
    }
    
    if (form.date) {
      const check = isVehicleAvailableForTrip(vehicleName, form.date, editId)
      if (!check.available) {
        setVehicleWarning(check.reason)
      } else {
        setVehicleWarning('')
      }
    } else {
      setVehicleWarning('')
    }
  }
  
  const handleDateChange = (date) => {
    setForm({...form, date: date})
    
    if (!date || !form.vehicle) {
      setVehicleWarning('')
      return
    }
    
    const check = isVehicleAvailableForTrip(form.vehicle, date, editId)
    if (!check.available) {
      setVehicleWarning(check.reason)
    } else {
      setVehicleWarning('')
    }
  }
  
    const save = () => {
    const validation = validateRequiredFields(form, ['driver', 'vehicle', 'from', 'to', 'date'])
    if (!validation.isValid) {
      const fieldNames = { driver: 'Driver', vehicle: 'Vehicle', from: 'From', to: 'To', date: 'Date' }
      showToast(`Please fill in the ${fieldNames[validation.missingFields[0]]} field`, 'error')
      return
    }

    if (isNaN(form.distance) || form.distance < 0) { showToast('Distance must be a positive number', 'error'); return }
    if (isNaN(form.cost) || form.cost < 0) { showToast('Cost must be a positive number', 'error'); return }

    if (form.vehicle && form.date && form.status === 'in-progress') {
      const check = isVehicleAvailableForTrip(form.vehicle, form.date, editId)
      if (!check.available) { showToast(`Cannot save trip: ${check.reason}`, 'error'); return }
    }
    
    // Check if status changed for Toast alert
    const oldTrip = editId ? trips.find(x => x.id === editId) : null
    const statusChanged = oldTrip && oldTrip.status !== form.status

    if (editId) updateTrip(form)
    else addTrip(form)
    
    if (statusChanged) {
      showToast(`Trip status updated to "${form.status}"`, 'success')
    } else {
      showToast('Trip saved successfully', 'success')
    }
    setModalOpen(false)
  }
  
  const remove = (id) => { 
    if (confirm('Delete this trip?')) {
      deleteTrip(id)
      showToast('Trip deleted', 'success')
    }
  }

  const sc = { 
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', 
    'in-progress': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 
    scheduled: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', 
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trips</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage all trips</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm"><Plus size={16} /> New Trip</button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 flex-1"><Search size={16} className="text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-sm flex-1 text-slate-800 dark:text-slate-100" /></div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"><option value="all">All</option><option value="scheduled">Scheduled</option><option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
        </div>
        
        <div className="overflow-x-auto">
          {filtered.length === 0 ? <EmptyState icon={Route} title="No trips yet" description="Log your first trip to start tracking routes and costs." actionLabel="New Trip" onAction={openAdd} /> : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(t => {
                  const availability = getVehicleAvailability(t.vehicle)
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-brand-600" /><span className="font-medium text-slate-800 dark:text-slate-100">{t.from}</span><span className="text-slate-400">→</span><span className="font-medium text-slate-800 dark:text-slate-100">{t.to}</span></div></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{t.driver}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600 dark:text-slate-300">{t.vehicle}</span>
                          {t.status === 'in-progress' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">On Trip</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{t.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{t.distance} km</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{formatLoti(t.cost)}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${sc[t.status]}`}>{t.status}</span></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"><Edit2 size={16} /></button>
                        <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 ml-1"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Trip' : 'New Trip'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Driver *">
            <select value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} className="input">
              <option value="">Select</option>
              {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </F>
          <F label="Vehicle *">
            <select value={form.vehicle} onChange={e => handleVehicleChange(e.target.value)} className="input">
              <option value="">Select</option>
              {vehicles.map(v => {
                const avail = getVehicleAvailability(v.name)
                const isUnavailable = avail.status !== 'available' && form.status === 'in-progress'
                return (
                  <option key={v.id} value={v.name} disabled={isUnavailable}>
                    {v.name} {isUnavailable && `(${avail.label})`}
                  </option>
                )
              })}
            </select>
            {vehicleWarning && (
              <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200">{vehicleWarning}</p>
              </div>
            )}
          </F>
          <F label="From *"><input value={form.from} onChange={e => setForm({...form, from: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="To *"><input value={form.to} onChange={e => setForm({...form, to: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="Date *">
            <input type="date" value={form.date} onChange={e => handleDateChange(e.target.value)} className="input" />
          </F>
          <F label="Status">
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </F>
          <F label="Distance (km)"><input type="number" value={form.distance} onChange={e => setForm({...form, distance: +e.target.value})} className="input" /></F>
          <F label="Cost (L)"><input type="number" value={form.cost} onChange={e => setForm({...form, cost: +e.target.value})} className="input" /></F>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium">Save</button>
        </div>
        <style>{`.input{width:100%;padding:.5rem .75rem;border:1px solid #e2e8f0;border-radius:.5rem;font-size:.875rem;outline:none;background:white;color:#1e293b}.dark .input{background:#1e293b;color:#f1f5f9;border-color:#334155}.input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}`}</style>
      </Modal>
    </div>
  )
}

function F({ label, children }) { return <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">{label}</label>{children}</div> }