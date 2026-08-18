import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import About from './Components/About'
import Contact from './Components/Contact'
import AvailablePackages from './Components/AvailablePackages'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/home" element={<Home />} />
        <Route path="/available-packages" element={<AvailablePackages />} />
      </Routes>
    </div>
  )
}

export default App
