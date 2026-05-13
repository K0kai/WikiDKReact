import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { ArticleProvider } from './context/ArticleContext.tsx'
import { ArticleGroupProvider } from './context/ArticleGroupContext.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ArticleProvider>
          <ArticleGroupProvider>
            <CategoryProvider>
              <App />
            </CategoryProvider>
          </ArticleGroupProvider>
        </ArticleProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
