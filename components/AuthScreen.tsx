

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IMAGES } from '../constants';
import { t, Language, LANGUAGES } from '../i18n';

export const AuthScreen: React.FC = () => {
  const { login, language, setLanguage } = useAuth();
  const [email, setEmail] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="px-3 py-2 border border-sky-300 rounded-lg bg-white text-sky-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center max-w-md">
        {/* Gemini missing banner */}
        <ConfigBanner />
        <img src={IMAGES.logo} alt="Resilios Logo" className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-sky-800">{t('auth.welcome', language)}</h1>
        <p className="mt-4 text-lg text-slate-600">
          {t('auth.subtitle', language)}
        </p>

        {/* Pricing infographic */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-md text-left">
          <h2 className="text-xl font-semibold text-sky-800">{t('pricing.title', language)}</h2>
          
          {/* Free Tier Card */}
          <div className="mt-4 p-3 border-2 border-sky-200 rounded-lg bg-sky-50">
            <div className="font-bold text-sky-800">{t('pricing.free', language)}</div>
            <div className="text-sm text-slate-600">{t('pricing.freeTier', language)}</div>
          </div>

          {/* Premium Tier Card */}
          <div className="mt-3 p-3 border-2 border-green-500 rounded-lg bg-green-50">
            <div className="flex justify-between items-center">
              <div className="font-bold text-green-800">{t('pricing.premium', language)}</div>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">New</span>
            </div>
            <div className="text-sm text-green-700">{t('pricing.premiumPrice', language)}</div>
            <div className="text-xs text-green-600 mt-1">✓ {t('pricing.sevenDayTrial', language)}</div>
            <div className="text-xs text-green-600">✓ {t('pricing.cardRequired', language)}</div>
          </div>

          {/* Features List */}
          <div className="mt-4">
            <div className="font-semibold text-sm text-sky-800 mb-2">{t('pricing.features', language)}:</div>
            <ul className="space-y-1 text-xs text-slate-700">
              <li>✔ {t('pricing.unlimitedChats', language)}</li>
              <li>✔ {t('pricing.deeperThinking', language)}</li>
              <li>✔ {t('pricing.videoAnalysis', language)}</li>
              <li>✔ {t('pricing.fullWellnessPlan', language)}</li>
              <li>✔ {t('pricing.priorityFeatures', language)}</li>
            </ul>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6">
          <label className="block text-sm text-slate-600 mb-2">{t('auth.emailPlaceholder', language)}</label>
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
            {t('auth.loginButton', language)}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400">
          By continuing you consent to Resilios sending emails to the provided Gmail for account management and optional marketing communications. You can opt out later.
        </p>
      </div>
    </div>
  );
};

// Small banner component to show if Gemini key is missing
const ConfigBanner: React.FC = () => {
  const [config, setConfig] = React.useState<any>(null);
  React.useEffect(() => {
    const dismissed = window.localStorage.getItem('resilios_gemini_banner_dismissed');
    if (dismissed === '1') return;
    fetch('/config').then((r) => r.json()).then((d) => setConfig(d)).catch(() => {});
  }, []);

  if (!config) return null;
  if (config.hasGeminiKey) return null;

  const dismiss = () => {
    window.localStorage.setItem('resilios_gemini_banner_dismissed', '1');
    setConfig({ ...config, hidden: true });
  };

  if (config.hidden) return null;

  return (
    <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 flex justify-between items-start">
      <div>
        Gemini model key not configured on the server — live avatar and AI replies will show fallback text. Configure `GEMINI_API_KEY` on the backend to enable full functionality.
      </div>
      <div className="ml-3">
        <button onClick={dismiss} className="text-yellow-700 underline text-xs">Dismiss</button>
      </div>
    </div>
  );
};
