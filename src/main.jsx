import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
// import Form from './Form.jsx'
// import FormEngineProvider from './context/FormEngineProvider';
import router from './router/Routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <RouterProvider router={router} />
    {/*<FormEngineProvider>
      <Form />
    </FormEngineProvider> */}

  </StrictMode>,
)