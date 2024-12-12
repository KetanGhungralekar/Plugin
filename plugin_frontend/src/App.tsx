import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { VideoRecorder } from '../src/components/VideoRecorder';
import AllVideos from '../src/pages/AllVideos';
import { AuthProvider, useAuth } from './context'; // Import AuthProvider and useAuth
import LoginPage from '../src/pages/login';
import Navbar from '../src/pages/Navbar';
import LandingPage from '../src/pages/home';

function ProtectedRoute({ children }) {
  const { token } = useAuth(); // Access token from the context

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/record-video"
              element={
                <ProtectedRoute>
                  <VideoRecorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decode-video"
              element={
                <ProtectedRoute>
                  <AllVideos />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
