import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { storage } from '../utils/storage'

const FleetContext = createContext(null)

export const useFleet = () => {
  const ctx = useContext(FleetContext)
  if (ctx === null) throw new Error('useFleet() was called outside of <FleetProvider>.')
  return ctx
}

const DATA_EXPIRY_DAYS = 2

const KEYS = {
  vehicles: 'fleetpro-vehicles',
  drivers: 'fleetpro-drivers',
  trips: 'fleetpro-trips',
  maintenance: 'fleetpro-maintenance',
  fuel: 'fleetpro-fuel',
  bookings: 'fleetpro-bookings',
  notifications: 'fleetpro-notifications',
}

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

const getToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(() => storage.get(KEYS.vehicles) || [])
  const [drivers, setDrivers] = useState(() => storage.get(KEYS.drivers) || [])
  const [trips, setTrips] = useState(() => storage.get(KEYS.trips) || [])
  const [maintenance, setMaintenance] = useState(() => storage.get(KEYS.maintenance) || [])
  const [fuel, setFuel] = useState(() => storage.get(KEYS.fuel) || [])
  const [bookings, setBookings] = useState(() => storage.get(KEYS.bookings) || [])
  const [notifications, setNotifications] = useState(() =>
    storage.get(KEYS.notifications) || [
      { id: 1, title: 'Welcome to FleetPro Lesotho', message: 'Start by adding your first vehicle and driver.', time: 'Just now', read: false }
    ]
  )

  // Refs to track previous values for change detection
  const prevVehiclesRef = useRef(vehicles)
  const prevTripsRef = useRef(trips)
  const prevBookingsRef = useRef(bookings)
  const prevMaintenanceRef = useRef(maintenance)

  useEffect(() => { storage.set(KEYS.vehicles, vehicles, DATA_EXPIRY_DAYS) }, [vehicles])
  useEffect(() => { storage.set(KEYS.drivers, drivers, DATA_EXPIRY_DAYS) }, [drivers])
  useEffect(() => { storage.set(KEYS.trips, trips, DATA_EXPIRY_DAYS) }, [trips])
  useEffect(() => { storage.set(KEYS.maintenance, maintenance, DATA_EXPIRY_DAYS) }, [maintenance])
  useEffect(() => { storage.set(KEYS.fuel, fuel, DATA_EXPIRY_DAYS) }, [fuel])
  useEffect(() => { storage.set(KEYS.bookings, bookings, DATA_EXPIRY_DAYS) }, [bookings])
  useEffect(() => { storage.set(KEYS.notifications, notifications, DATA_EXPIRY_DAYS) }, [notifications])

  // ============ NOTIFICATION DETECTION (FIXED - No duplicates) ============

  // Detect vehicle status changes
  useEffect(() => {
    const prev = prevVehiclesRef.current
    vehicles.forEach(v => {
      const old = prev.find(x => x.id === v.id)
      if (old && old.status !== v.status) {
        addNotification({
          title: 'Vehicle Status Changed',
          message: `${v.name} status updated to ${v.status}.`
        })
      }
    })
    prevVehiclesRef.current = vehicles
  }, [vehicles])

  // Detect trip status changes
  useEffect(() => {
    const prev = prevTripsRef.current
    trips.forEach(t => {
      const old = prev.find(x => x.id === t.id)
      if (old && old.status !== t.status) {
        addNotification({
          title: 'Trip Status Changed',
          message: `Trip ${t.from} → ${t.to} is now ${t.status}.`
        })
      }
    })
    prevTripsRef.current = trips
  }, [trips])

  // Detect booking status changes
  useEffect(() => {
    const prev = prevBookingsRef.current
    bookings.forEach(b => {
      const old = prev.find(x => x.id === b.id)
      if (old && old.status !== b.status) {
        addNotification({
          title: 'Booking Status Changed',
          message: `${b.vehicle} booking is now ${b.status}.`
        })
      }
    })
    prevBookingsRef.current = bookings
  }, [bookings])

  // Detect maintenance status changes
  useEffect(() => {
    const prev = prevMaintenanceRef.current
    maintenance.forEach(m => {
      const old = prev.find(x => x.id === m.id)
      if (old && old.status !== m.status) {
        addNotification({
          title: 'Maintenance Status Changed',
          message: `${m.vehicle} ${m.type} is now ${m.status}.`
        })
      }
    })
    prevMaintenanceRef.current = maintenance
  }, [maintenance])


  const addVehicle = (v) => setVehicles(prev => [...prev, { ...v, id: Date.now() }])
  const updateVehicle = (v) => setVehicles(prev => prev.map(x => x.id === v.id ? v : x))
  const deleteVehicle = (id) => setVehicles(prev => prev.filter(x => x.id !== id))

  const addDriver = (d) => setDrivers(prev => [...prev, { ...d, id: Date.now() }])
  const updateDriver = (d) => setDrivers(prev => prev.map(x => x.id === d.id ? d : x))
  const deleteDriver = (id) => setDrivers(prev => prev.filter(x => x.id !== id))

  const addTrip = (t) => setTrips(prev => [...prev, { ...t, id: Date.now() }])
  const updateTrip = (t) => setTrips(prev => prev.map(x => x.id === t.id ? t : x))
  const deleteTrip = (id) => setTrips(prev => prev.filter(x => x.id !== id))

  const addMaintenance = (m) => setMaintenance(prev => [...prev, { ...m, id: Date.now() }])
  const updateMaintenance = (m) => setMaintenance(prev => prev.map(x => x.id === m.id ? m : x))
  const deleteMaintenance = (id) => setMaintenance(prev => prev.filter(x => x.id !== id))

  const addFuel = (f) => setFuel(prev => [...prev, { ...f, id: Date.now() }])
  const deleteFuel = (id) => setFuel(prev => prev.filter(x => x.id !== id))

  const addBooking = (b) => setBookings(prev => [...prev, { ...b, id: Date.now() }])
  const updateBooking = (b) => setBookings(prev => prev.map(x => x.id === b.id ? b : x))
  const deleteBooking = (id) => setBookings(prev => prev.filter(x => x.id !== id))

  const markNotificationRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const addNotification = (n) =>
    setNotifications(prev => [{ ...n, id: Date.now(), time: 'Just now', read: false }, ...prev])

  const resetAllData = () => {
    if (confirm('This will delete ALL your data. Are you sure?')) {
      storage.clearAll()
      setVehicles([]); setDrivers([]); setTrips([]); setMaintenance([]); setFuel([]); setBookings([])
      setNotifications([{ id: Date.now(), title: 'Data Reset', message: 'All data cleared.', time: 'Just now', read: false }])
    }
  }

  const isVehicleBooked = (vehicleName, excludeBookingId = null) => {
    const today = getToday()
    return bookings.some(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false
      if (b.vehicle !== vehicleName || b.status !== 'approved') return false
      const startDate = parseLocalDate(b.startDate)
      const endDate = parseLocalDate(b.endDate)
      if (!startDate || !endDate) return false
      return today >= startDate && today <= endDate
    })
  }

  const isVehicleOnTrip = (vehicleName, excludeTripId = null) => {
    return trips.some(t => {
      if (excludeTripId && t.id === excludeTripId) return false
      if (t.vehicle !== vehicleName || t.status !== 'in-progress') return false
      return true
    })
  }

  const isVehicleAvailableForBooking = (vehicleName, startDateStr, endDateStr, excludeBookingId = null) => {
    const start = parseLocalDate(startDateStr)
    const end = parseLocalDate(endDateStr)
    if (!start || !end) return { available: true, reason: null }
    if (isVehicleOnTrip(vehicleName)) return { available: false, reason: 'Vehicle is currently on an active trip' }
    const hasConflict = bookings.some(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false
      if (b.vehicle !== vehicleName || (b.status !== 'approved' && b.status !== 'pending')) return false
      const bStart = parseLocalDate(b.startDate)
      const bEnd = parseLocalDate(b.endDate)
      if (!bStart || !bEnd) return false
      return start <= bEnd && end >= bStart
    })
    if (hasConflict) return { available: false, reason: 'Vehicle has conflicting bookings on these dates' }
    return { available: true, reason: null }
  }

  const isVehicleAvailableForTrip = (vehicleName, tripDateStr, excludeTripId = null) => {
    const date = parseLocalDate(tripDateStr)
    if (!date) return { available: true, reason: null }
    if (isVehicleOnTrip(vehicleName, excludeTripId)) return { available: false, reason: 'Vehicle is currently on another active trip' }
    const isBooked = bookings.some(b => {
      if (b.vehicle !== vehicleName || b.status !== 'approved') return false
      const bStart = parseLocalDate(b.startDate)
      const bEnd = parseLocalDate(b.endDate)
      if (!bStart || !bEnd) return false
      return date >= bStart && date <= bEnd
    })
    if (isBooked) return { available: false, reason: 'Vehicle is booked on this date' }
    return { available: true, reason: null }
  }

  const getVehicleAvailability = (vehicleName) => {
    if (isVehicleOnTrip(vehicleName)) return { status: 'on-trip', label: 'On Trip', color: 'text-blue-600 dark:text-blue-400' }
    if (isVehicleBooked(vehicleName)) return { status: 'booked', label: 'Booked', color: 'text-amber-600 dark:text-amber-400' }
    return { status: 'available', label: 'Available', color: 'text-emerald-600 dark:text-emerald-400' }
  }

  return (
    <FleetContext.Provider value={{
      vehicles, drivers, trips, maintenance, fuel, bookings, notifications,
      addVehicle, updateVehicle, deleteVehicle,
      addDriver, updateDriver, deleteDriver,
      addTrip, updateTrip, deleteTrip,
      addMaintenance, updateMaintenance, deleteMaintenance,
      addFuel, deleteFuel,
      addBooking, updateBooking, deleteBooking,
      markNotificationRead, addNotification, resetAllData,
      isVehicleBooked, isVehicleOnTrip, isVehicleAvailableForBooking, isVehicleAvailableForTrip, getVehicleAvailability
    }}>
      {children}
    </FleetContext.Provider>
  )
}