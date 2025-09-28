import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/index.css'
import { BrowserRouter } from 'react-router-dom'
import RoutesConfig from '@/app/routes.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { ErrorModalProvider } from '@/shared/context/ui/ErrorModal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorModalProvider>
        <BrowserRouter>
          <RoutesConfig />
        </BrowserRouter>
      </ErrorModalProvider>
    </Provider>
  </StrictMode>,
)
