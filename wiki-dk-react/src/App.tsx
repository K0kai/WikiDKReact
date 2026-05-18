//import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Register from "./components/Register"
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Home from "./components/Home"
import ArticlesPage from './components/ArticlesPage'
import ArticlePage from './components/ArticlePage'
import ArticleEditor from './components/editors/ArticleEditor'
import ManagerHub from './components/ManagerHub'
import ArticleCreator from './components/editors/ArticleCreator'
import UserProfile from './components/UserProfile'
import Submissions from './components/Submissions'
import SubmissionPreviewPage from './components/SubmissionPreview'
import { useToast } from './hooks/useToast'
import { ToastContainer } from './components/reusable/ToastContainer'
import { registerToast } from './lib/toast'

function App({}) {
const { toasts,toast, dismiss } = useToast();
registerToast(toast)
  return (
    <>
      <Header />
      
      <div className="app-container nobg">            
        <Sidebar />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />    
        <div className="mainContent nobg">          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/article/:id/edit" element={<ArticleEditor />} />
            <Route path="/article/create" element={<ArticleCreator />} />
            <Route path="/manage" element={<ManagerHub />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/submissions" element={<Submissions/>}/>
            <Route path="preview" element={<SubmissionPreviewPage/>}/>
            
          </Routes>
          
          
        </div>
      </div>
    </>
  );
}

export default App
