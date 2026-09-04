import { useEffect, useState } from 'react'
import { Eye, Users } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import { storage } from '../utils/storage'

export default function SecretAdmin() {
  const { vehicles, drivers, trips, fuel, bookings } = useFleet()
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <h1 className="text-2xl font-bold mb-6">🔒 Secret Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Vehicles" value={vehicles.length} color="text-blue-400" />
        <Card title="Drivers" value={drivers.length} color="text-emerald-400" />
        <Card title="Trips" value={trips.length} color="text-purple-400" />
        <Card title="Fuel Logs" value={fuel.length} color="text-orange-400" />
        <Card title="Bookings" value={bookings.length} color="text-pink-400" />
        <Card title="Storage Used" value={`${storage.getUsage().kb} KB`} color="text-cyan-400" />
      </div>
      <p className="mt-6 text-sm text-slate-400">Data expires after 2 days of inactivity. Visit <a href="/" className="text-brand-400 underline">Dashboard</a> to manage data.</p>
    </div>
  )
}

function Card({ title, value, color }) {
  return <div className="bg-slate-800 p-6 rounded-xl border border-slate-700"><p className="text-sm text-slate-400 mb-1">{title}</p><p className={`text-3xl font-bold ${color}`}>{value}</p></div>
}