import { useState } from 'react'
import { Plus, Search, Calendar, Check, X, Clock, CalendarDays, Car, AlertTriangle } from 'lucide-react'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { useFleet } from '../context/FleetContext'
import { useToast } from '../context/ToastContext'
import { validateRequiredFields } from '../utils/validation'

const emptyForm = { vehicle: '', requester: '', purpose: '', startDate: '', endDate: '', status: 'pending' }

export default function Bookings() {
  const { bookings, vehicles, addBooking, updateBooking, deleteBooking, isVehicleAvailableForBooking, getVehicleAvailability } = useFleet()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [bookingWarning, setBookingWarning] = useState('')

  const filtered = bookings.filter(b => (filterStatus === 'all' || b.status === filterStatus) && (b.vehicle.toLowerCase().includes(search.toLowerCase()) || b.requester.toLowerCase().includes(search.toLowerCase())))
  
  const openAdd = () => { 
    setForm(emptyForm)
    setEditId(null)
    setBookingWarning('')
    setModalOpen(true) 
  }
  
  const openEdit = (b) => { 
    setForm(b)
    setEditId(b.id)
    setBookingWarning('')
    setModalOpen(true) 
  }
  
  const handleVehicleChange = (vehicleName) => {
    setForm({...form, vehicle: vehicleName})
    
    if (!vehicleName || !form.startDate || !form.endDate) {
      setBookingWarning('')
      return
    }
    
    const check = isVehicleAvailableForBooking(vehicleName, form.startDate, form.endDate, editId)
    if (!check.available) {
      setBookingWarning(check.reason)
    } else {
      setBookingWarning('')
    }
  }
  
  const handleStartDateChange = (date) => {
    const newForm = {...form, startDate: date}
    setForm(newForm)
    
    if (!form.vehicle || !date || !form.endDate) {
      setBookingWarning('')
      return
    }
    
    const check = isVehicleAvailableForBooking(form.vehicle, date, form.endDate, editId)
    if (!check.available) {
      setBookingWarning(check.reason)
    } else {
      setBookingWarning('')
    }
  }
  
  const handleEndDateChange = (date) => {
    const newForm = {...form, endDate: date}
    setForm(newForm)
    
    if (!form.vehicle || !form.startDate || !date) {
      setBookingWarning('')
      return
    }
    
    const check = isVehicleAvailableForBooking(form.vehicle, form.startDate, date, editId)
    if (!check.available) {
      setBookingWarning(check.reason)
    } else {
      setBookingWarning('')
    }
  }
  
    const save = () => {
    const validation = validateRequiredFields(form, ['vehicle', 'requester', 'purpose', 'startDate', 'endDate'])
    if (!validation.isValid) {
      const fieldNames = { vehicle: 'Vehicle', requester: 'Requester', purpose: 'Purpose', startDate: 'Start Date', endDate: 'End Date' }
      showToast(`Please fill in the ${fieldNames[validation.missingFields[0]]} field`, 'error')
      return
    }

    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (end < start) { showToast('End date cannot be before start date', 'error'); return }

    if (form.vehicle && form.startDate && form.endDate && form.status === 'approved') {
      const check = isVehicleAvailableForBooking(form.vehicle, form.startDate, form.endDate, editId)
      if (!check.available) { showToast(`Cannot approve booking: ${check.reason}`, 'error'); return }
    }
    
    // Check if status changed for Toast alert
    const oldBooking = editId ? bookings.find(x => x.id === editId) : null
    const statusChanged = oldBooking && oldBooking.status !== form.status

    if (editId) updateBooking(form)
    else addBooking(form)
    
    if (statusChanged) {
      showToast(`Booking status updated to "${form.status}"`, 'success')
    } else {
      showToast('Booking saved successfully', 'success')
    }
    setModalOpen(false)
  }
  
  const remove = (id) => { 
    if (confirm('Cancel this booking?')) {
      deleteBooking(id)
      showToast('Booking deleted', 'success')
    }
  }
  
  const quickStatus = (id, status) => { 
    const b = bookings.find(x => x.id === id)
    if (!b) return
    
    // If approving, check availability
    if (status === 'approved') {
      const check = isVehicleAvailableForBooking(b.vehicle, b.startDate, b.endDate, id)
      if (!check.available) {
        showToast(`Cannot approve booking: ${check.reason}`, 'error')
        return
      }
    }
    
    updateBooking({...b, status})
    showToast(`Booking ${status}`, 'success')
  }

  const sc = { 
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', 
    approved: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', 
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', 
    rejected: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Vehicle Bookings</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage vehicle reservations and availability</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm"><Plus size={16} /> New Booking</button>
      </div>
      
      {vehicles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2"><Car size={18} className="text-brand-600" /> Fleet Availability</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {vehicles.map(v => {
              const avail = getVehicleAvailability(v.name)
              const bgColor = avail.status === 'available' 
                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' 
                : avail.status === 'booked'
                ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              
              return (
                <div key={v.id} className={`p-3 rounded-lg border text-center ${bgColor}`}>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{v.name}</p>
                  <span className={`text-[10px] font-bold uppercase ${avail.color}`}>{avail.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 flex-1"><Search size={16} className="text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-sm flex-1 text-slate-800 dark:text-slate-100" /></div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"><option value="all">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="rejected">Rejected</option></select>
        </div>
        
        <div className="overflow-x-auto">
          {filtered.length === 0 ? <EmptyState icon={CalendarDays} title="No bookings yet" description="Create a booking to reserve a vehicle." actionLabel="New Booking" onAction={openAdd} /> : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                  <th className="text-left px-4 py-3 font-semibold">Requester</th>
                  <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold">Dates</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{b.vehicle}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{b.requester}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{b.purpose}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300"><div className="flex items-center gap-1"><Calendar size={14} />{b.startDate}{b.startDate !== b.endDate && ` → ${b.endDate}`}</div></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${sc[b.status]}`}>{b.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => quickStatus(b.id, 'approved')} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600" title="Approve"><Check size={16} /></button>
                          <button onClick={() => quickStatus(b.id, 'rejected')} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 ml-1" title="Reject"><X size={16} /></button>
                        </>
                      )}
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 ml-1"><Calendar size={16} /></button>
                      <button onClick={() => remove(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 ml-1"><X size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Booking' : 'New Vehicle Booking'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Vehicle *">
            <select value={form.vehicle} onChange={e => handleVehicleChange(e.target.value)} className="input">
              <option value="">Select</option>
              {vehicles.map(v => {
                const avail = getVehicleAvailability(v.name)
                const isUnavailable = avail.status === 'on-trip'
                return (
                  <option key={v.id} value={v.name} disabled={isUnavailable}>
                    {v.name} {isUnavailable && `(${avail.label})`}
                  </option>
                )
              })}
            </select>
          </F>
          <F label="Requester *"><input value={form.requester} onChange={e => setForm({...form, requester: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="Purpose *" full><input value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="input" placeholder="Required" /></F>
          <F label="Start Date *">
            <input type="date" value={form.startDate} onChange={e => handleStartDateChange(e.target.value)} className="input" />
          </F>
          <F label="End Date *">
            <input type="date" value={form.endDate} onChange={e => handleEndDateChange(e.target.value)} className="input" />
          </F>
          {bookingWarning && (
            <div className="sm:col-span-2 flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">{bookingWarning}</p>
            </div>
          )}
          {editId && (
            <F label="Status" full>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </F>
          )}
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

function F({ label, children, full }) { return <div className={full ? 'sm:col-span-2' : ''}><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">{label}</label>{children}</div> }