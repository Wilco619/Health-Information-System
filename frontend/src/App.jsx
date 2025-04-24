import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/contexts/AuthContext'
import ProtectedRoute from './auth/components/ProtectedRoute'
import LoginForm from './auth/components/LoginForm'
import OTPVerification from './auth/components/OTPVerification'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import ProgramList from './components/programs/ProgramList'
import ClientList from './components/clients/ClientList'
import ClientProfile from './components/clients/ClientProfile'
import ClientRegistration from './components/clients/ClientRegistration'
import ClientEnrollment from './components/clients/ClientEnrollment'

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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programs"
              element={
                <ProtectedRoute>
                  <ProgramList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <ClientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <ClientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute>
                  <ClientRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id/enroll"
              element={
                <ProtectedRoute>
                  <ClientEnrollment />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
