//import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Home from "./components/Home"
import ArticlesPage from './components/ArticlesPage'
import ArticlePage from './components/ArticlePage'
import ArticleEditor from './components/editors/ArticleEditor'
import ManagerHub from './components/ManagerHub'
import ArticleCreator from './components/editors/ArticleCreator'
import UserProfile from './components/UserProfile'

function App() {
  return (
    <>
      <Header />
      <div className="app-container nobg">
        <Sidebar />
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
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App
