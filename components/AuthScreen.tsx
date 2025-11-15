
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IMAGES } from '../constants';

export const AuthScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 p-4">
      <div className="text-center max-w-md">
        <img src={IMAGES.logo} alt="Resilios Logo" className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-sky-800">Welcome to Resilios</h1>
        <p className="mt-4 text-lg text-slate-600">
          Your AI companion for building a personalized 'operating manual' for your mental wellness.
        </p>

        {/* Pricing infographic */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-md text-left">
          <h2 className="text-xl font-semibold">Pricing</h2>
          <p className="mt-2 text-sm text-slate-600">Free: 100 chat messages / UTC day • Premium: <strong>$4.99 / month</strong> • Live Avatar is premium.</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>✔ Free entry-level experience (100 chats/day)</li>
            <li>✔ Wellness plan editor, mascots, and basic tools free</li>
            <li>✔ Premium: unlimited Live Avatar + priority features</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="mt-6">
          <label className="block text-sm text-slate-600 mb-2">Sign in with Gmail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            className="w-full max-w-xs px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />

          <button
            type="submit"
            className="w-full max-w-xs mt-4 px-6 py-3 text-lg font-semibold text-white bg-sky-500 rounded-lg shadow-md hover:bg-sky-600 transition-transform transform hover:scale-105"
          >
            Continue with Gmail
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400">
          By continuing you consent to Resilios sending emails to the provided Gmail for account management and optional marketing communications. You can opt out later.
        </p>
      </div>
    </div>
  );
};
