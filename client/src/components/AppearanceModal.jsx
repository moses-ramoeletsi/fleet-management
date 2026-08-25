import { useState, useEffect } from 'react'
import { X, Sun, Moon, Monitor, Check, Palette, Sparkles } from 'lucide-react'
import { useTheme, ACCENT_PRESETS } from '../context/ThemeContext'

const themes = [
  { id: 'light',  label: 'Light',  icon: Sun },
  { id: 'dark',   label: 'Dark',   icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
]

export default function AppearanceModal({ open, onClose }) {
  const { theme, setTheme, accent, setAccent } = useTheme()
  const [previewTheme, setPreviewTheme] = useState(theme)
  const [previewAccent, setPreviewAccent] = useState(accent)

  // Sync preview with actual when modal opens
  useEffect(() => {
    if (open) {
      setPreviewTheme(theme)
      setPreviewAccent(accent)
    }
  }, [open, theme, accent])

  if (!open) return null

  const applyAndClose = () => {
    setTheme(previewTheme)
    setAccent(previewAccent)
    onClose()
  }

  const reset = () => {
    setPreviewTheme('light')
    setPreviewAccent('blue')
  }

  const currentPreset = ACCENT_PRESETS.find(p => p.id === previewAccent)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-slate-700 text-brand-600">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customize how FleetPro looks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Live Preview Card */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Live Preview</label>
            <div className={`rounded-xl border-2 overflow-hidden ${
              previewTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`} style={{ borderColor: previewTheme === 'dark' ? undefined : currentPreset?.hex + '40' }}>
              <div className={`p-4 ${previewTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ background: currentPreset?.hex }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${previewTheme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                      FleetPro Lesotho
                    </div>
                    <div className={`text-xs ${previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Preview with {currentPreset?.name}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="p-3 rounded-lg"
                      style={{
                        background: previewTheme === 'dark' ? '#1e293b' : currentPreset?.light,
                        border: `1px solid ${previewTheme === 'dark' ? '#334155' : currentPreset?.hex + '30'}`
                      }}
                    >
                      <div className={`text-xs ${previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Stat {i}</div>
                      <div className={`text-lg font-bold ${previewTheme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                        {i * 127}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-3 px-3 py-1.5 rounded-lg text-white text-xs font-medium"
                  style={{ background: currentPreset?.hex }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(t => {
                const Icon = t.icon
                const selected = previewTheme === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setPreviewTheme(t.id)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? 'border-brand-600 bg-brand-50 dark:bg-slate-700'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <Icon size={22} className={selected ? 'text-brand-600' : 'text-slate-500 dark:text-slate-400'} />
                    <div className={`mt-2 text-sm font-medium ${selected ? 'text-brand-700 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.id === 'light' && 'Always light'}
                      {t.id === 'dark' && 'Always dark'}
                      {t.id === 'system' && 'Match device'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Accent Color</label>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentPreset?.name}</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {ACCENT_PRESETS.map(p => {
                const selected = previewAccent === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setPreviewAccent(p.id)}
                    title={p.name}
                    className="group relative"
                  >
                    <div
                      className={`w-full aspect-square rounded-xl transition-all ${
                        selected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{
                        background: p.hex,
                        ringColor: p.hex,
                      }}
                    />
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check size={18} className="text-white drop-shadow" />
                      </div>
                    )}
                    <div className="mt-1.5 text-[10px] text-center text-slate-600 dark:text-slate-400 truncate">
                      {p.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={reset}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Reset to defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={applyAndClose}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm"
              style={{ background: currentPreset?.hex }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}