import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoadingProvider } from './contexts/loading.jsx'
import Loading from '@components/loading'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <Loading></Loading>
      <App />
    </LoadingProvider>
  </StrictMode>,
)
