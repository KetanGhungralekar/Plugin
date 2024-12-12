import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { VideoRecorder } from '../src/components/VideoRecorder';
import AllVideos from '../src/pages/AllVideos';
import { AuthProvider } from './context'; // Import AuthProvider
import LoginPage from '../src/pages/login';
import Navbar from '../src/pages/Navbar';
import LandingPage from '../src/pages/home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation Links (optional, for routing) */}
          <Navbar />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/record-video" element={<VideoRecorder />} />
            <Route path="/decode-video" element={<AllVideos />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Home() {
  return (
    <div className="p-4">
      <h1>Welcome to the Video Recording App</h1>
      <p>Click the link above to start recording a video.</p>
    </div>
  );
}

export default App;
