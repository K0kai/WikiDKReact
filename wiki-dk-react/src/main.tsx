import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './AuthContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { ArticleProvider } from './context/ArticleContext.tsx'
import { ArticleGroupProvider } from './context/ArticleGroupContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ArticleProvider>
        <ArticleGroupProvider>
          <CategoryProvider>
            <App />
          </CategoryProvider>
        </ArticleGroupProvider>
      </ArticleProvider>
    </AuthProvider>
  </StrictMode>,
)
