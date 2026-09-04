import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Truck, Eye, EyeOff, AlertCircle, Sparkles, Shield, Clock, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@lec.co.ls')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try { await login(email, password); navigate('/') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" /><div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white blur-3xl" /></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Truck size={26} /></div>
            <div><h1 className="text-xl font-bold">FleetPro Lesotho</h1><p className="text-xs text-white/70">Enterprise Fleet Management</p></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Take control of your fleet.<br /><span className="text-white/80">Drive smarter decisions.</span></h2>
            <p className="text-lg text-white/80 max-w-md">Real-time tracking, maintenance scheduling, fuel analytics, and executive reporting — built for Lesotho businesses.</p>
            <div className="flex flex-wrap gap-2 pt-4">{['Real-time Tracking','Fuel Analytics','Maintenance Alerts','Route Optimization'].map(f => (<span key={f} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm border border-white/20">{f}</span>))}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
            <div><p className="text-3xl font-bold">500+</p><p className="text-sm text-white/70">Vehicles Managed</p></div>
            <div><p className="text-3xl font-bold">99.9%</p><p className="text-sm text-white/70">Uptime</p></div>
            <div><p className="text-3xl font-bold">24/7</p><p className="text-sm text-white/70">Support</p></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white"><Truck size={22} /></div>
            <div><h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">FleetPro Lesotho</h1><p className="text-xs text-slate-500">Fleet Management System</p></div>
          </div>
          <div className="mb-8"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome back</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to access your fleet dashboard</p></div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email</label><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" /></div></div>
            <div><div className="flex items-center justify-between mb-1.5"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label><button type="button" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot?</button></div><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            <div className="flex items-center"><input type="checkbox" defaultChecked id="remember" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" /><label htmlFor="remember" className="ml-2 text-sm text-slate-600 dark:text-slate-300">Keep me signed in</label></div>
            {error && <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"><AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" /><p className="text-sm text-red-700 dark:text-red-300">{error}</p></div>}
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>) : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-brand-600 text-white flex-shrink-0"><Sparkles size={14} /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">Demo Access</p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-2 text-brand-800 dark:text-brand-200"><span className="text-brand-600">Email:</span><span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded">admin@lec.co.ls</span></div>
                  <div className="flex items-center gap-2 text-brand-800 dark:text-brand-200"><span className="text-brand-600">Pass:</span><span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded">demo123</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4 text-center">
            <div><Shield size={18} className="mx-auto text-slate-400" /><p className="text-[10px] text-slate-500 mt-1">Bank-grade Security</p></div>
            <div><Clock size={18} className="mx-auto text-slate-400" /><p className="text-[10px] text-slate-500 mt-1">99.9% Uptime</p></div>
            <div><Globe size={18} className="mx-auto text-slate-400" /><p className="text-[10px] text-slate-500 mt-1">Made in Lesotho</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}