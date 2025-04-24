import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/contexts/AuthContext'
import ProtectedRoute from './auth/components/ProtectedRoute'
import LoginForm from './auth/components/LoginForm'
import OTPVerification from './auth/components/OTPVerification'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
