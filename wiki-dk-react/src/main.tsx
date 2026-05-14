import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CategoryProvider } from './context/CategoryContext.tsx'
import { ArticleProvider } from './context/ArticleContext.tsx'
import { ArticleGroupProvider } from './context/ArticleGroupContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { OtherUserProvider } from './context/OtherUserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ArticleGroupProvider>
          <ArticleProvider>
            <CategoryProvider>
              <OtherUserProvider>
                <App />
              </OtherUserProvider>
            </CategoryProvider>
          </ArticleProvider>
        </ArticleGroupProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
