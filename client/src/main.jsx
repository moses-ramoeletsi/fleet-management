import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FleetProvider } from './context/FleetContext.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FleetProvider>
          <App />
        </FleetProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
