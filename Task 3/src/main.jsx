import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode is intentionally off: it renders every component twice in dev,
// which would make the console.log() render investigation confusing.
createRoot(document.getElementById('root')).render(<App />)
