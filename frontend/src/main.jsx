import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'
import './app.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Toaster position='top-center' richColors />
    <App />
  </>
)
