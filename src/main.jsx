import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ✅ Import Router
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter basename="/mubarak-product"> {/* ✅ basename for GitHub Pages */}
            <App />
        </BrowserRouter>
    </StrictMode>,
)
