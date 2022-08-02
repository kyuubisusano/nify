import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './scroll.css'
import { OnboardProvider } from "./context/OnboardContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <OnboardProvider>
    <App />
  </OnboardProvider>
  </React.StrictMode>
)
