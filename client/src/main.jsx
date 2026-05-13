import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App.jsx'
import '@/index.css'

const theme = window.localStorage.getItem('technova-theme') ?? 'dark'
document.documentElement.classList.toggle('dark', theme === 'dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
