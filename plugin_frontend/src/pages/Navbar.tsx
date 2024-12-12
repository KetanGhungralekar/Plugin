import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">
          <a href="/" className="rounded-full px-4 py-2 hover:bg-gray-800 transition-colors">
            My App
          </a>
        </div>
        <div>
          <a
            href="/login"
            className="mx-4 hover:bg-gray-800 rounded-full px-4 py-2 transition-colors"
          >
            Login
          </a>
          <a
            href="/record-video"
            className="mx-4 hover:bg-gray-800 rounded-full px-4 py-2 transition-colors"
          >
            Recorded Videos
          </a>
          <a
            href="/decode-video"
            className="mx-4 hover:bg-gray-800 rounded-full px-4 py-2 transition-colors"
          >
            Stored Videos
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;