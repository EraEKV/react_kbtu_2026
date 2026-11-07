import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.js'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/global.css'
import './styles/components.css'
import './styles/pages.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // basename = the "base" from vite.config.js, so links work in a subfolder too
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,
)
