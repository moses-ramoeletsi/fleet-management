export const storage = {
  set(key, data, expiryDays = 2) {
    const item = {
      data,
      timestamp: Date.now(),
      expiry: expiryDays ? Date.now() + (expiryDays * 24 * 60 * 60 * 1000) : null
    }
    try {
      localStorage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      console.error('Storage error:', error)
      return false
    }
  },

  get(key) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const item = JSON.parse(raw)
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key)
        return null
      }
      return item.data
    } catch (error) {
      console.error('Storage read error:', error)
      return null
    }
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('fleetpro-'))
      .forEach(k => localStorage.removeItem(k))
  },

  getUsage() {
    let total = 0
    Object.keys(localStorage)
      .filter(k => k.startsWith('fleetpro-'))
      .forEach(k => { total += (localStorage.getItem(k) || '').length })
    return { bytes: total, kb: (total / 1024).toFixed(2) }
  }
}