import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { VideoRecorder } from '../src/components/VideoRecorder';
import AllVideos from '../src/pages/AllVideos';
import { AuthProvider } from './context'; // Import AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation Links (optional, for routing) */}
          <nav className="p-4 bg-gray-800 text-white">
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/record-video" className="mr-4">Record Video</Link>
            <Link to="/decode-video">Decode Video</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
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
