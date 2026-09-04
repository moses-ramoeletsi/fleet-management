import { useState } from 'react'
import { Plus, Search, Phone, Mail, Star, Users } from 'lucide-react'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { isValidLesothoPhone, validateRequiredFields } from '../utils/validation'

const emptyForm = { name: '', license: '', phone: '', email: '', status: 'active', trips: 0, rating: 5, vehicle: '' }

export default function Drivers() {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver } = useFleet()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const filtered = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
  
  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (d) => { setForm(d); setEditId(d.id); setModalOpen(true) }
  
  const handlePhoneChange = (e) => {
    let val = e.target.value
    // Only allow digits and +
    val = val.replace(/[^0-9+]/g, '')
    // Only allow + at the beginning
    if (val.indexOf('+') > 0) {
      val = val.replace(/\+/g, '')
    }
    // Limit to 11 characters (+266 + 8 digits)
    if (val.length > 11) return
    
    setForm({...form, phone: val})
  }
  
  const save = () => {
    // Validate required fields
    const validation = validateRequiredFields(form, ['name', 'license', 'phone', 'email'])
    if (!validation.isValid) {
      const fieldNames = {
        name: 'Name',
        license: 'License',
        phone: 'Phone',
        email: 'Email'
      }
      const missingField = fieldNames[validation.missingFields[0]]
      showToast(`Please fill in the ${missingField} field`, 'error')
      return
    }

    // Validate Lesotho phone number
    if (!isValidLesothoPhone(form.phone)) {
      showToast('Invalid phone number. Please use Lesotho format (e.g., +266 5XXX XXXX or 5XXX XXXX)', 'error')
      return
    }

    // Save
    if (editId) updateDriver(form)
    else addDriver(form)
    
    showToast('Driver saved successfully', 'success')
    setModalOpen(false)
  }

  const remove = (id) => { 
    if (confirm('Delete this driver?')) {
      deleteDriver(id)
      showToast('Driver deleted', 'success')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Drivers</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your driver team</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm"><Plus size={16} /> Add Driver</button>
      </div>
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 max-w-md"><Search size={16} className="text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..." className="bg-transparent outline-none text-sm flex-1 text-slate-800 dark:text-slate-100" /></div>
      
      {filtered.length === 0 ? <EmptyState icon={Users} title="No drivers yet" description="Add your first driver to start assigning vehicles." actionLabel="Add First Driver" onAction={openAdd} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map(d => (
          <div key={d.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-semibold">{d.name.split(' ').map(n=>n[0]).join('')}</div><div><h3 className="font-semibold text-slate-800 dark:text-slate-100">{d.name}</h3><p className="text-xs text-slate-500">{d.license}</p></div></div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status==='active'?'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300':'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{d.status}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm"><div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Phone size={14} />{d.phone}</div><div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Mail size={14} />{d.email}</div></div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-lg font-bold text-slate-800 dark:text-slate-100">{d.trips}</p><p className="text-xs text-slate-500">Trips</p></div>
              <div><div className="flex items-center justify-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /><span className="text-lg font-bold text-slate-800 dark:text-slate-100">{d.rating}</span></div><p className="text-xs text-slate-500">Rating</p></div>
              <div><p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{d.vehicle||'—'}</p><p className="text-xs text-slate-500">Vehicle</p></div>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={()=>openEdit(d)} className="flex-1 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200">Edit</button><button onClick={()=>remove(d.id)} className="flex-1 py-1.5 text-sm rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium text-red-600">Delete</button></div>
          </div>
        ))}</div>
      )}
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Driver' : 'Add Driver'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Full Name *"><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="License Number *"><input value={form.license} onChange={e => setForm({...form, license: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="Phone (Lesotho Only) *">
            <input 
              value={form.phone} 
              onChange={handlePhoneChange} 
              className="input" 
              placeholder="+266 5XXX XXXX" 
            />
            <p className="text-[10px] text-slate-400 mt-1">Format: +266 5XXX XXXX or 5XXX XXXX</p>
          </F>
          <F label="Email *"><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="Status"><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input"><option value="active">Active</option><option value="on-leave">On Leave</option></select></F>
          <F label="Vehicle"><select value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} className="input"><option value="">Select</option>{vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}</select></F>
          <F label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: +e.target.value})} className="input" /></F>
          <F label="Total Trips"><input type="number" value={form.trips} onChange={e => setForm({...form, trips: +e.target.value})} className="input" /></F>
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