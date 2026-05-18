import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import AppLoader from './AppLoader.tsx'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {toast} from "./lib/toast.ts"

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toast("Sucesso", String(mutation.meta.successMessage), "success");
      }
    },
    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.errorMessage) {
        toast("Erro", String(mutation.meta.errorMessage), "error");
      }
    },
    onSettled: (_data, _error, _variables, _onMutateResult, mutation) => {
      if (mutation.meta?.invalidateQueries){
        queryClient.invalidateQueries(mutation.meta?.invalidateQueries)
      }
    }
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppLoader>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </AppLoader>
    </BrowserRouter>
  </StrictMode>,
)
