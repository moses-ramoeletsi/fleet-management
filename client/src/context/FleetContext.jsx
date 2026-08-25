import { createContext, useContext, useState } from 'react'

const FleetContext = createContext(null)

export const useFleet = () => {
  const ctx = useContext(FleetContext)
  if (ctx === null) {
    throw new Error('useFleet() was called outside of <FleetProvider>.')
  }
  return ctx
}

// ============ LESOTHO LOCALIZED DATA ============

const initialVehicles = [
  { id: 1, name: 'Truck Thabo',     plate: 'B 1234 T',  type: 'Heavy Truck',    status: 'active',      driver: 'Thabo Mokoena',     fuel: 78, mileage: 45230, lastService: '2026-07-10', location: 'Maseru' },
  { id: 2, name: 'Van Lineo',       plate: 'C 5678 L',  type: 'Delivery Van',   status: 'active',      driver: 'Lineo Ramotsoane',  fuel: 45, mileage: 32100, lastService: '2026-06-22', location: 'Leribe' },
  { id: 3, name: 'Sedan Teboho',    plate: 'D 9012 T',  type: 'Sedan',          status: 'maintenance', driver: 'Teboho Nkuebe',     fuel: 92, mileage: 18500, lastService: '2026-08-15', location: 'Maseru Garage' },
  { id: 4, name: 'Truck Malefu',    plate: 'B 3456 M',  type: 'Heavy Truck',    status: 'active',      driver: 'Malefu Letsie',     fuel: 33, mileage: 67800, lastService: '2026-05-30', location: 'Mohale\'s Hoek' },
  { id: 5, name: 'Van Motlatsi',    plate: 'C 7890 M',  type: 'Delivery Van',   status: 'idle',        driver: 'Motlatsi Phakisi',  fuel: 61, mileage: 28900, lastService: '2026-07-25', location: 'Mafeteng' },
  { id: 6, name: 'SUV Palesa',      plate: 'A 1122 P',  type: 'SUV',            status: 'active',      driver: 'Palesa Tšita',      fuel: 55, mileage: 41200, lastService: '2026-08-01', location: 'Qacha\'s Nek' },
]

const initialDrivers = [
  { id: 1, name: 'Thabo Mokoena',     license: 'LS-DL-001234', phone: '+266 5800 1001', email: 'thabo@fleet.ls',     status: 'active',   trips: 142, rating: 4.8, vehicle: 'Truck Thabo' },
  { id: 2, name: 'Thatho Ramotsoane',  license: 'LS-DL-002345', phone: '+266 5800 1002', email: 'lineo@fleet.ls',     status: 'active',   trips: 98,  rating: 4.9, vehicle: 'Van Lineo' },
  { id: 3, name: 'Teboho Nkuebe',     license: 'LS-DL-003456', phone: '+266 5800 1003', email: 'teboho@fleet.ls',    status: 'on-leave', trips: 76,  rating: 4.6, vehicle: 'Sedan Teboho' },
  { id: 4, name: 'Lefu Letsie',     license: 'LS-DL-004567', phone: '+266 5800 1004', email: 'malefu@fleet.ls',    status: 'active',   trips: 210, rating: 4.7, vehicle: 'Truck Malefu' },
  { id: 5, name: 'Motlatsi Phakisi',  license: 'LS-DL-005678', phone: '+266 5800 1005', email: 'motlatsi@fleet.ls',  status: 'active',   trips: 54,  rating: 4.5, vehicle: 'Van Motlatsi' },
  { id: 6, name: 'Pule Tšita',      license: 'LS-DL-006789', phone: '+266 5800 1006', email: 'palesa@fleet.ls',    status: 'active',   trips: 128, rating: 4.8, vehicle: 'SUV Palesa' },
]

const initialTrips = [
  { id: 1, driver: 'Thabo Mokoena',    vehicle: 'Truck Thabo',  from: 'Maseru',         to: 'Leribe',          status: 'completed',   date: '2026-08-24', distance: 65,  cost: 850 },
  { id: 2, driver: 'Thatho Ramotsoane', vehicle: 'Van Lineo',    from: 'Leribe',         to: 'Butha-Buthe',     status: 'in-progress', date: '2026-08-25', distance: 48,  cost: 620 },
  { id: 3, driver: 'Lefu Letsie',    vehicle: 'Truck Malefu', from: 'Mohale\'s Hoek', to: 'Quthing',         status: 'in-progress', date: '2026-08-25', distance: 95,  cost: 1240 },
  { id: 4, driver: 'Pule Tšita',     vehicle: 'SUV Palesa',   from: 'Qacha\'s Nek',   to: 'Mokhotlong',      status: 'completed',   date: '2026-08-23', distance: 120, cost: 1560 },
  { id: 5, driver: 'Motlatsi Phakisi', vehicle: 'Van Motlatsi', from: 'Mafeteng',       to: 'Maseru',          status: 'scheduled',   date: '2026-08-26', distance: 72,  cost: 940 },
  { id: 6, driver: 'Thabo Mokoena',    vehicle: 'Truck Thabo',  from: 'Maseru',         to: 'Mohale\'s Hoek',  status: 'scheduled',   date: '2026-08-27', distance: 110, cost: 1430 },
]

const initialMaintenance = [
  { id: 1, vehicle: 'Sedan Teboho',   type: 'Engine Service',      date: '2026-08-15', status: 'completed', cost: 1700, mechanic: 'Maseru Auto Centre' },
  { id: 2, vehicle: 'Truck Malefu',   type: 'Tire Replacement',    date: '2026-08-28', status: 'scheduled', cost: 2400, mechanic: 'Leribe Tyre & Fitment' },
  { id: 3, vehicle: 'Van Lineo',      type: 'Oil Change',          date: '2026-08-30', status: 'scheduled', cost: 240,  mechanic: 'QuickLube Maseru' },
  { id: 4, vehicle: 'Truck Thabo',    type: 'Brake Inspection',    date: '2026-09-05', status: 'scheduled', cost: 680,  mechanic: 'Maseru Auto Centre' },
  { id: 5, vehicle: 'SUV Palesa',     type: 'Battery Replacement', date: '2026-08-20', status: 'completed', cost: 560,  mechanic: 'Qacha\'s Nek Motors' },
]

const initialFuel = [
  { id: 1, vehicle: 'Truck Thabo',  date: '2026-08-24', liters: 120, cost: 360, location: 'Total Maseru' },
  { id: 2, vehicle: 'Van Lineo',    date: '2026-08-23', liters: 65,  cost: 195, location: 'Engen Leribe' },
  { id: 3, vehicle: 'Truck Malefu', date: '2026-08-22', liters: 140, cost: 420, location: 'Shell Mohale\'s Hoek' },
  { id: 4, vehicle: 'SUV Palesa',   date: '2026-08-21', liters: 55,  cost: 165, location: 'Caltex Qacha\'s Nek' },
  { id: 5, vehicle: 'Van Motlatsi', date: '2026-08-20', liters: 70,  cost: 210, location: 'Total Mafeteng' },
]

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [drivers, setDrivers] = useState(initialDrivers)
  const [trips, setTrips] = useState(initialTrips)
  const [maintenance, setMaintenance] = useState(initialMaintenance)
  const [fuel, setFuel] = useState(initialFuel)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Low fuel alert',      message: 'Truck Malefu has only 33% fuel remaining',           time: '10 min ago',  read: false },
    { id: 2, title: 'Maintenance due',     message: 'Van Lineo oil change scheduled for Aug 30',          time: '1 hour ago',  read: false },
    { id: 3, title: 'Trip completed',      message: 'Thabo Mokoena completed Maseru → Leribe trip',       time: '3 hours ago', read: true },
  ])

  const addVehicle = (v) => setVehicles([...vehicles, { ...v, id: Date.now() }])
  const updateVehicle = (v) => setVehicles(vehicles.map(x => x.id === v.id ? v : x))
  const deleteVehicle = (id) => setVehicles(vehicles.filter(x => x.id !== id))

  const addDriver = (d) => setDrivers([...drivers, { ...d, id: Date.now() }])
  const updateDriver = (d) => setDrivers(drivers.map(x => x.id === d.id ? d : x))
  const deleteDriver = (id) => setDrivers(drivers.filter(x => x.id !== id))

  const addTrip = (t) => setTrips([...trips, { ...t, id: Date.now() }])
  const updateTrip = (t) => setTrips(trips.map(x => x.id === t.id ? t : x))
  const deleteTrip = (id) => setTrips(trips.filter(x => x.id !== id))

  const addMaintenance = (m) => setMaintenance([...maintenance, { ...m, id: Date.now() }])
  const updateMaintenance = (m) => setMaintenance(maintenance.map(x => x.id === m.id ? m : x))
  const deleteMaintenance = (id) => setMaintenance(maintenance.filter(x => x.id !== id))

  const addFuel = (f) => setFuel([...fuel, { ...f, id: Date.now() }])
  const deleteFuel = (id) => setFuel(fuel.filter(x => x.id !== id))

  const markNotificationRead = (id) =>
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <FleetContext.Provider value={{
      vehicles, drivers, trips, maintenance, fuel, notifications,
      addVehicle, updateVehicle, deleteVehicle,
      addDriver, updateDriver, deleteDriver,
      addTrip, updateTrip, deleteTrip,
      addMaintenance, updateMaintenance, deleteMaintenance,
      addFuel, deleteFuel,
      markNotificationRead
    }}>
      {children}
    </FleetContext.Provider>
  )
}