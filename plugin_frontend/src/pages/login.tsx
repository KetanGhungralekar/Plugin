import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { RiArrowRightSLine } from 'react-icons/ri';
// import { Poppins } from 'next/font/google';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';

// const poppins = Poppins({
//   weight: ['400', '500', '600', '700'],
//   subsets: ['latin'],
// });

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signin, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSigningIn) {
      try {
        signup(username, username, password, 'ROLE_USER');
        console.log('Signing up with:', username, password);
        navigate('/record-video');
      } catch (error) {
        console.error('Signup error:', error);
      }
      console.log('Signing in with:', username, password);
    } else {
      try {
        signin(username, password);
        navigate('/record-video');
      }
      catch (error) {
        console.error('Signin error:', error);
      }
      console.log('Logging in with:', username, password);
    }
  };

  const toggleSignIn = () => {
    setIsSigningIn(!isSigningIn);
  };

  return (
    <div className={`flex items-center justify-center h-screen bg-gray-100`}>
      <div className="bg-white shadow-lg rounded-lg px-8 pt-12 pb-8 mb-4 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {isSigningIn ? 'Welcome Back!' : 'Let\'s Get Started'}
          </h1>
          <p className="text-gray-500">
            {isSigningIn
              ? 'Sign in to your account to continue'
              : 'Create a new account to access our services'}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-600" htmlFor="username">
              <FaLock className="w-5 h-5 inline-block mr-2" />
              Username
            </label>
            <input
              className="bg-gray-200 shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-600" htmlFor="password">
              <FaLock className="w-5 h-5 inline-block mr-2" />
              Password
            </label>
            <input
              className="bg-gray-200 shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full flex items-center focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isSigningIn ? 'Sign In' : 'Create Account'}
              <RiArrowRightSLine className="w-5 h-5 ml-2" />
            </button>
            
            <a
              className="inline-block align-baseline font-medium text-sm text-blue-500 hover:text-blue-600"
              href="#"
              onClick={toggleSignIn}
            >
              {isSigningIn ? 'Create Account' : 'Sign In'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
