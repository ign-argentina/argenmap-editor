import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import FormEngineProvider from './context/FormEngineProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormEngineProvider>
      <App />
    </FormEngineProvider>

  </StrictMode>,
)
