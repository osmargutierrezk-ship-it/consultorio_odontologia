import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#3D5A45',
              color: '#fff',
              borderRadius: '12px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C9A84C', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
