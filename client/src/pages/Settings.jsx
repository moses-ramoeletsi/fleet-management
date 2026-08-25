import { useState } from 'react'
import { Save, User, Bell, Shield, Palette, Sun, Moon, Monitor, Sparkles } from 'lucide-react'
import { useTheme, ACCENT_PRESETS } from '../context/ThemeContext'
import AppearanceModal from '../components/AppearanceModal'

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: 'Ntate Khotso',
    email: 'khotso@fleetpro.ls',
    phone: '+266 5800 0100',
    company: 'FleetPro Lesotho (Pty) Ltd',
    role: 'Administrator'
  })
  const [notif, setNotif] = useState({ email: true, sms: true, lowFuel: true, maintenance: true, trips: false })
  const [saved, setSaved] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)

  const { theme, accent } = useTheme()
  const currentAccent = ACCENT_PRESETS.find(p => p.id === accent) || ACCENT_PRESETS[0]

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile',       label: 'Profile',       icon: User },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance',    label: 'Appearance',    icon: Palette },
    // { id: 'security',      label: 'Security',      icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    tab === t.id
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* ============ PROFILE ============ */}
          {tab === 'profile' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                  NK
                </div>
                <div>
                  <button className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                    Change Avatar
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG. Max 2MB.</p>
                </div>
              </div>
              <Grid>
                <Field label="Full Name">
                  <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="input" />
                </Field>
                <Field label="Email">
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="input" />
                </Field>
                <Field label="Phone">
                  <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="input" />
                </Field>
                <Field label="Company">
                  <input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className="input" />
                </Field>
                <Field label="Role" full>
                  <input value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="input" />
                </Field>
              </Grid>
            </div>
          )}

          {/* ============ NOTIFICATIONS ============ */}
          {tab === 'notifications' && (
            <div className="space-y-3 max-w-2xl">
              <Toggle label="Email Notifications" desc="Receive updates via email" value={notif.email} onChange={v => setNotif({...notif, email: v})} />
              <Toggle label="SMS Notifications" desc="Receive updates via SMS" value={notif.sms} onChange={v => setNotif({...notif, sms: v})} />
              <Toggle label="Low Fuel Alerts" desc="Alert when vehicle fuel drops below 30%" value={notif.lowFuel} onChange={v => setNotif({...notif, lowFuel: v})} />
              <Toggle label="Maintenance Reminders" desc="Get notified about upcoming maintenance" value={notif.maintenance} onChange={v => setNotif({...notif, maintenance: v})} />
              <Toggle label="Trip Updates" desc="Notifications for trip status changes" value={notif.trips} onChange={v => setNotif({...notif, trips: v})} />
            </div>
          )}

          {/* ============ APPEARANCE ============ */}
          {tab === 'appearance' && (
            <div className="max-w-2xl space-y-6">
              {/* Current Selection Summary */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: currentAccent.hex }}
                  >
                    <Palette size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Current Appearance</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'} theme • {currentAccent.name} accent
                    </p>
                  </div>
                </div>

                {/* Live mini-preview */}
                <div className={`rounded-lg border overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                        style={{ background: currentAccent.hex }}
                      >
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                          FleetPro Lesotho
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {currentAccent.name} theme preview
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          className="p-2 rounded-md text-center"
                          style={{
                            background: theme === 'dark' ? '#1e293b' : currentAccent.light,
                            border: `1px solid ${theme === 'dark' ? '#334155' : currentAccent.hex + '30'}`
                          }}
                        >
                          <div className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Metric {i}</div>
                          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{i * 42}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Theme Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light',  label: 'Light',  icon: Sun,     desc: 'Always light' },
                    { id: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Always dark' },
                    { id: 'system', label: 'System', icon: Monitor, desc: 'Match device' },
                  ].map(t => {
                    const Icon = t.icon
                    const selected = theme === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => window.dispatchEvent(new CustomEvent('fleetpro:setTheme', { detail: t.id }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? 'border-brand-600 bg-brand-50 dark:bg-slate-700'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Icon size={22} className={selected ? 'text-brand-600' : 'text-slate-500 dark:text-slate-400'} />
                        <div className={`mt-2 text-sm font-medium ${selected ? 'text-brand-700 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'}`}>
                          {t.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quick Accent Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_PRESETS.map(p => {
                    const selected = accent === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => window.dispatchEvent(new CustomEvent('fleetpro:setAccent', { detail: p.id }))}
                        title={p.name}
                        className="group relative"
                      >
                        <div
                          className={`w-10 h-10 rounded-full transition-all ${
                            selected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110' : 'hover:scale-105'
                          }`}
                          style={{ background: p.hex, '--tw-ring-color': p.hex }}
                        />
                        <div className="mt-1 text-[10px] text-center text-slate-600 dark:text-slate-400">{p.name}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Open Full Customizer Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => setAppearanceOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm transition-transform hover:scale-[1.02]"
                  style={{ background: currentAccent.hex }}
                >
                  <Palette size={16} />
                  Open Full Customizer
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Launch the full appearance modal with live preview and more options.
                </p>
              </div>
            </div>
          )}

          {/* ============ SECURITY ============ */}
          {tab === 'security' && (
            <div className="space-y-4 max-w-2xl">
              <Grid>
                <Field label="Current Password"><input type="password" placeholder="••••••••" className="input" /></Field>
                <Field label="New Password"><input type="password" placeholder="••••••••" className="input" /></Field>
                <Field label="Confirm Password" full><input type="password" placeholder="••••••••" className="input" /></Field>
              </Grid>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Add an extra layer of security to your account.</p>
                <button className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            {saved && <span className="text-sm text-emerald-600 font-medium">✓ Changes saved successfully</span>}
            {!saved && <span />}
            <button onClick={save} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Modal */}
      <AppearanceModal open={appearanceOpen} onClose={() => setAppearanceOpen(false)} />

      <style>{`
        .input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; outline: none; background: white; color: #1e293b; }
        .dark .input { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
      `}</style>
    </div>
  )
}

function Grid({ children }) { return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div> }
function Field({ label, children, full }) {
  return <div className={full ? 'sm:col-span-2' : ''}><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">{label}</label>{children}</div>
}
function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-100">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full ${value ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}