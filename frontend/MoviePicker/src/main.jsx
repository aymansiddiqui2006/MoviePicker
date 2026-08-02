import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RoomContextProvider from "../src/context/RoomContextProvider.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoomContextProvider>
      <App />
    </RoomContextProvider>
  </StrictMode>,
)