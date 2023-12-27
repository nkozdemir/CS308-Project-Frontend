import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Toaster
        position="top-center"
        toastOptions={{
          custom: {
            duration: 3000,
          },
        }}
        containerStyle={{
          marginTop: '24px',
        }}
      />
      <App />
  </React.StrictMode>,
)
