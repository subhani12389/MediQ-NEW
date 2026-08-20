import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationBanner from './components/NotificationBanner';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import HospitalSearch from './pages/HospitalSearch';
import HospitalDetail from './pages/HospitalDetail';
import PatientDashboard from './pages/PatientDashboard';
import PatientHistory from './pages/PatientHistory';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <QueueProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-red-500 selection:text-white">
                <Navbar />
                
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/hospitals" element={<HospitalSearch />} />
                    <Route path="/hospitals/:id" element={<HospitalDetail />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Patient Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['patient', 'admin']}>
                          <PatientDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <ProtectedRoute allowedRoles={['patient', 'admin']}>
                          <PatientHistory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Receptionist Route */}
                    <Route
                      path="/receptionist"
                      element={
                        <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                          <ReceptionistDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Admin Route */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>

                <NotificationBanner />
                <Footer />
              </div>
            </Router>
          </QueueProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
