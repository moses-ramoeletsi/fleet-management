import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (ctx === null) throw new Error('useTheme() must be used inside <ThemeProvider>')
  return ctx
}

// Preset accent palettes — each defines a full brand scale
export const ACCENT_PRESETS = [
  { id: 'blue',    name: 'Ocean Blue',   hex: '#2563eb', light: '#eff6ff', dark: '#1d4ed8' },
  { id: 'emerald', name: 'Emerald',      hex: '#059669', light: '#ecfdf5', dark: '#047857' },
  { id: 'orange',  name: 'Sunset',       hex: '#ea580c', light: '#fff7ed', dark: '#c2410c' },
  { id: 'rose',    name: 'Rose',         hex: '#e11d48', light: '#fff1f2', dark: '#be123c' },
  { id: 'violet',  name: 'Violet',       hex: '#7c3aed', light: '#f5f3ff', dark: '#6d28d9' },
  { id: 'amber',   name: 'Amber',        hex: '#d97706', light: '#fffbeb', dark: '#b45309' },
  { id: 'teal',    name: 'Teal',         hex: '#0d9488', light: '#f0fdfa', dark: '#0f766e' },
  { id: 'pink',    name: 'Pink',         hex: '#db2777', light: '#fdf2f8', dark: '#be185d' },
]

const STORAGE_KEY_THEME = 'fleetpro-theme'
const STORAGE_KEY_ACCENT = 'fleetpro-accent'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY_THEME) || 'light')
  const [accent, setAccent] = useState(() => localStorage.getItem(STORAGE_KEY_ACCENT) || 'blue')

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')

      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Apply accent color as CSS variables on :root
  useEffect(() => {
    const preset = ACCENT_PRESETS.find(p => p.id === accent) || ACCENT_PRESETS[0]
    const root = document.documentElement
    root.style.setProperty('--accent',       preset.hex)
    root.style.setProperty('--accent-light', preset.light)
    root.style.setProperty('--accent-dark',  preset.dark)
  }, [accent])

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme)
    localStorage.setItem(STORAGE_KEY_ACCENT, accent)
  }, [theme, accent])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}