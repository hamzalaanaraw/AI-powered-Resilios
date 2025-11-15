
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IMAGES } from '../constants';

export const AuthScreen: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 p-4">
      <div className="text-center max-w-md">
        <img src={IMAGES.logo} alt="Resilios Logo" className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-sky-800">Welcome to Resilios</h1>
        <p className="mt-4 text-lg text-slate-600">
          Your AI companion for building a personalized 'operating manual' for your mental wellness.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          This is a proactive approach to mental health, designed to help you feel prepared, in control, and less alone.
        </p>
        <div className="mt-8">
          <button
            onClick={login}
            className="w-full max-w-xs px-6 py-3 text-lg font-semibold text-white bg-sky-500 rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform hover:scale-105"
          >
            Login as Demo User
          </button>
        </div>
         <p className="mt-8 text-xs text-slate-400">
          By continuing, you acknowledge that Resilios is an AI companion and not a substitute for professional medical advice, diagnosis, or treatment. If you are in crisis, please contact a local emergency number immediately.
        </p>
      </div>
    </div>
  );
};
