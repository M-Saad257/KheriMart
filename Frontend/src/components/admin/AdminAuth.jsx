import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuth = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkBlockStatus();
    const interval = setInterval(checkBlockStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkBlockStatus = () => {
    const blockData = JSON.parse(localStorage.getItem('adminBlockData') || '{}');
    if (blockData.blockedUntil) {
      const now = Date.now();
      const blockedUntil = Number(blockData.blockedUntil);

      if (now < blockedUntil) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((blockedUntil - now) / 1000));
      } else {
        setIsBlocked(false);
        setBlockTimeRemaining(0);
        localStorage.removeItem('adminBlockData');
      }
    } else {
      setIsBlocked(false);
      setBlockTimeRemaining(0);
    }
  };

  const updateLoginAttempts = () => {
    const now = Date.now();
    const blockData = JSON.parse(localStorage.getItem('adminBlockData') || '{}');

    // Reset attempts if last attempt was more than 30 minutes ago
    if (blockData.lastAttempt && now - blockData.lastAttempt > 30 * 60 * 1000) {
      blockData.attempts = 1;
    } else {
      blockData.attempts = (blockData.attempts || 0) + 1;
    }

    blockData.lastAttempt = now;

    if (blockData.attempts >= 3) {
      blockData.blockedUntil = now + 30 * 60 * 1000; // 30 minutes
      setIsBlocked(true);
      setBlockTimeRemaining(Math.ceil((blockData.blockedUntil - now) / 1000));
    }

    localStorage.setItem('adminBlockData', JSON.stringify(blockData));
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isBlocked) {
      setError(`Access blocked. Please try again in ${Math.ceil(blockTimeRemaining / 60)} minutes.`);
      return;
    }

    const adminUser = 'CEO-KM';
    const adminPass = 'intelcorei5vpro8gen';

    if (credentials.username === adminUser && credentials.password === adminPass) {
      localStorage.removeItem('adminBlockData');
      navigate('/admin/dashboard');
    } else {
      updateLoginAttempts();
      const attempts = JSON.parse(localStorage.getItem('adminBlockData') || '{}').attempts || 0;
      const remainingAttempts = 3 - attempts;

      if (remainingAttempts > 0) {
        setError(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
      } else {
        setError('Too many failed attempts. Account blocked for 30 minutes.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7ede2]">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#9f6b4a]">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="admin username"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f6b4a]"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f6b4a]"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {isBlocked && (
            <p className="text-orange-600 text-sm">Blocked for {Math.ceil(blockTimeRemaining / 60)} minutes and {blockTimeRemaining % 60} seconds</p>
          )}

          <button
            type="submit"
            disabled={isBlocked}
            className={`w-full ${isBlocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9f6b4a] hover:bg-[#7c4f37]'} text-white py-2 cursor-pointer rounded-lg transition duration-300`}
          >
            {isBlocked ? 'Access Blocked' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
