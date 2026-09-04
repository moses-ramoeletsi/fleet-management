import { useState } from 'react'
import {
  Book, Search, LayoutDashboard, Truck, Users, Route, Wrench, Fuel,
  BarChart3, Settings, ChevronDown, ChevronRight, Mail, Phone, MessageCircle,
  Play, Download, ExternalLink, AlertCircle, CheckCircle2, Lightbulb
} from 'lucide-react'

const sections = [
  { id: 'getting-started', label: 'Getting Started', icon: Play },
  { id: 'dashboard',       label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'vehicles',        label: 'Vehicles',        icon: Truck },
  { id: 'drivers',         label: 'Drivers',         icon: Users },
  { id: 'trips',           label: 'Trips',           icon: Route },
  { id: 'maintenance',     label: 'Maintenance',     icon: Wrench },
  { id: 'fuel',            label: 'Fuel Tracking',   icon: Fuel },
  { id: 'reports',         label: 'Reports',         icon: BarChart3 },
  { id: 'settings',        label: 'Settings',        icon: Settings },
]

const faqs = [
  {
    q: 'How do I add a new vehicle to the fleet?',
    a: 'Navigate to the Vehicles page from the sidebar, click the "+ Add Vehicle" button, fill in the required details (name, plate number, type, driver assignment), and click Save. The vehicle will immediately appear in your fleet list and dashboard statistics.'
  },
  {
    q: 'Can I track fuel consumption per vehicle?',
    a: 'Yes! Go to the Fuel page and click "Add Entry" to log each refueling event. The system automatically calculates totals, averages, and displays consumption trends in the analytics chart. You can filter by vehicle to see individual consumption patterns.'
  },
  {
    q: 'How do I schedule vehicle maintenance?',
    a: 'In the Maintenance page, click "Add Record" and select the vehicle, maintenance type, scheduled date, and assigned mechanic. The system will track the status (scheduled/completed) and include costs in your financial reports.'
  },
  {
    q: 'Can I export reports to PDF or Excel?',
    a: 'Yes. On the Reports page, click the "Export PDF" button in the top-right corner. You can also export individual tables from the Vehicles, Trips, and Maintenance pages using the export options in each section.'
  },
  {
    q: 'How do I customize the appearance of the system?',
    a: 'Go to Settings → Appearance. You can switch between Light, Dark, or System theme modes, and choose from 8 accent colors. Your preferences are saved automatically and persist across devices.'
  },
  {
    q: 'What happens when a vehicle\'s fuel drops below 30%?',
    a: 'The system automatically generates a notification in the topbar bell icon. If you have email notifications enabled (Settings → Notifications), you\'ll also receive an email alert. The vehicle\'s fuel bar turns red as a visual indicator.'
  },
  {
    q: 'Can I assign multiple drivers to one vehicle?',
    a: 'Currently, each vehicle can have one primary driver assigned. For shift-based operations, we recommend creating separate vehicle entries (e.g., "Truck Thabo - Day Shift" and "Truck Thabo - Night Shift") or contacting support for enterprise configuration.'
  },
  {
    q: 'Is my data backed up automatically?',
    a: 'Yes. All data is automatically backed up daily to secure cloud storage with 99.9% uptime guarantee. You can also manually export your data anytime from the Reports page for your own records.'
  },
]

// Mock screenshot component
function MockScreenshot({ title, children, color = 'blue' }) {
  const colors = {
    blue:   'from-blue-500 to-blue-700',
    green:  'from-emerald-500 to-emerald-700',
    purple: 'from-purple-500 to-purple-700',
    orange: 'from-orange-500 to-orange-700',
  }
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className={`h-2 bg-gradient-to-r ${colors[color]}`} />
      <div className="bg-slate-100 dark:bg-slate-800 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 min-h-[180px] flex items-center justify-center">
          {children}
        </div>
      </div>
      <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 text-center italic">{title}</p>
      </div>
    </div>
  )
}

export default function Help() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [search, setSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Book size={20} className="text-brand-600" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Help Center</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">User guide, tutorials, and support resources</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Download size={16} /> Download PDF Manual
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium">
            <MessageCircle size={16} /> Contact Support
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documentation, FAQs, tutorials..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 sticky top-4">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-slate-400">Topics</p>
            {sections.map(s => {
              const Icon = s.icon
              const active = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id)
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Getting Started */}
          <section id="getting-started" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Play size={20} className="text-brand-600" /> Getting Started
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Welcome to FleetPro Lesotho. This guide will help you get up and running in minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Step number={1} title="Sign In" desc="Use your credentials to access the dashboard" />
              <Step number={2} title="Add Vehicles" desc="Register your fleet in the Vehicles section" />
              <Step number={3} title="Assign Drivers" desc="Link drivers to vehicles and start tracking" />
            </div>

            <MockScreenshot title="Fig 1.1 — The main dashboard showing fleet overview" color="blue">
              <div className="w-full space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg" />
                  ))}
                </div>
                <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-slate-400" size={32} />
                </div>
              </div>
            </MockScreenshot>

            <div className="mt-4 p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 flex gap-3">
              <Lightbulb size={18} className="text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">Pro Tip</p>
                <p className="text-sm text-brand-700 dark:text-brand-300 mt-1">
                  Use keyboard shortcuts: Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-xs">/</kbd> to search, <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-xs">G</kbd> then <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-xs">D</kbd> to go to Dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Dashboard */}
          <section id="dashboard" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <LayoutDashboard size={20} className="text-brand-600" /> Dashboard
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              The dashboard provides a real-time overview of your entire fleet. Key components include:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>KPI Cards:</strong> Total vehicles, active drivers, active trips, fuel levels, revenue, pending maintenance.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Trend Charts:</strong> 6-month visualization of trips and fuel consumption.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Vehicle Status Pie Chart:</strong> Distribution of active, idle, and maintenance vehicles.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Recent Trips:</strong> Latest trip activity with status indicators.</span></li>
            </ul>
            <MockScreenshot title="Fig 2.1 — Dashboard KPI cards and trend chart" color="green">
              <div className="w-full grid grid-cols-3 gap-2">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded" />)}
              </div>
            </MockScreenshot>
          </section>

          {/* Vehicles */}
          <section id="vehicles" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Truck size={20} className="text-brand-600" /> Vehicles
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Manage all fleet vehicles from a single table. Features include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300 mb-4">
              <Feature text="Search by name or license plate" />
              <Feature text="Filter by status (active/idle/maintenance)" />
              <Feature text="Real-time fuel level indicators" />
              <Feature text="Mileage tracking" />
              <Feature text="Current location display" />
              <Feature text="Edit and delete operations" />
            </div>
            <MockScreenshot title="Fig 3.1 — Vehicles table with fuel indicators" color="purple">
              <div className="w-full space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                    <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${40 + i * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </MockScreenshot>
          </section>

          {/* Drivers */}
          <section id="drivers" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Users size={20} className="text-brand-600" /> Drivers
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              View drivers as cards with contact info, ratings, trip counts, and assigned vehicles. Use the search bar to quickly find any driver.
            </p>
            <MockScreenshot title="Fig 4.1 — Driver cards with ratings and stats" color="orange">
              <div className="grid grid-cols-2 gap-3 w-full">
                {[1,2].map(i => (
                  <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-orange-300 dark:bg-orange-700 rounded-full mb-2" />
                    <div className="h-2 w-20 bg-orange-200 dark:bg-orange-800 rounded mb-1" />
                    <div className="h-2 w-14 bg-orange-100 dark:bg-orange-900/40 rounded" />
                  </div>
                ))}
              </div>
            </MockScreenshot>
          </section>

          {/* Trips */}
          <section id="trips" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Route size={20} className="text-brand-600" /> Trips
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Track all trips with route details, driver, vehicle, distance, cost, and status. Filter by status (scheduled, in-progress, completed, cancelled) to focus on what matters.
            </p>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Trip costs are calculated in Maloti (L) and include fuel, driver allowances, and operational expenses.
              </p>
            </div>
          </section>

          {/* Maintenance */}
          <section id="maintenance" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Wrench size={20} className="text-brand-600" /> Maintenance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Schedule and track all vehicle servicing. View total maintenance costs, upcoming appointments, and completed work orders. Assign mechanics and track expenses per vehicle.
            </p>
          </section>

          {/* Fuel */}
          <section id="fuel" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Fuel size={20} className="text-brand-600" /> Fuel Tracking
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Log every refueling event with liters, cost, and location. The system automatically calculates totals, averages, and visualizes consumption trends across your fleet.
            </p>
          </section>

          {/* Reports */}
          <section id="reports" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <BarChart3 size={20} className="text-brand-600" /> Reports & Analytics
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Comprehensive analytics including monthly cost breakdowns, vehicle mileage trends, trip status distribution, and vehicle type distribution. Export reports as PDF for management presentations.
            </p>
          </section>

          {/* Settings */}
          <section id="settings" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Settings size={20} className="text-brand-600" /> Settings
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Manage your profile, notification preferences, appearance (theme & accent colors), and security settings including two-factor authentication.
            </p>
          </section>

          {/* FAQ */}
          <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100 text-sm pr-4">{faq.q}</span>
                    {expandedFaq === i ? <ChevronDown size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <p className="text-center py-8 text-sm text-slate-500">No FAQs match your search.</p>
              )}
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Still need help?</h2>
            <p className="text-white/80 text-sm mb-4">Our support team is available 24/7 to assist you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ContactCard icon={Mail} label="Email" value="support@fleetpro.ls" />
              <ContactCard icon={Phone} label="Phone" value="+266 2232 2236" />
              <ContactCard icon={MessageCircle} label="Live Chat" value="Available 24/7" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, desc }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center mb-2">
        {number}
      </div>
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
    </div>
  )
}

function Feature({ text }) {
  return (
    <div className="flex gap-2">
      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </div>
  )
}

function ContactCard({ icon: Icon, label, value }) {
  return (
    <div className="p-3 rounded-lg bg-white/10 backdrop-blur border border-white/20">
      <Icon size={18} className="mb-1" />
      <p className="text-xs text-white/70">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}