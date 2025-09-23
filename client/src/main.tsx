import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/index.css'
import { BrowserRouter } from 'react-router-dom'
import RoutesConfig from '@/app/routes.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RoutesConfig />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
