import { CheckCircle, AlertCircle, X } from 'lucide-react'

export default function Toast({ message, type, onClose }) {
  const isError = type === 'error'
  
  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] ${
        isError 
          ? 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' 
          : 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100'
      }`}>
        {isError ? <AlertCircle size={20} className="flex-shrink-0" /> : <CheckCircle size={20} className="flex-shrink-0" />}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}