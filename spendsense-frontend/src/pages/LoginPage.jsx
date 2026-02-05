import React, { useState } from 'react';
import axios from 'axios';
import { Wallet } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Send credentials to Backend
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      // 2. The backend sends back a text string (The Token)
      const token = response.data;

      // 3. Store it securely in the browser
      localStorage.setItem('jwt_token', token);

      // 4. Tell App.jsx we are logged in!
      onLoginSuccess();

    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* Logo */}
        <div className="flex justify-center mb-6 text-blue-600">
          <Wallet className="w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Welcome to SpendSense
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Use email: <b>test@test.com</b> <br/> password: <b>password</b>
        </p>
      </div>
    </div>
  );
}