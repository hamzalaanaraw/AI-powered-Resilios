
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { Language, detectLanguage } from '../i18n';

interface AuthContextType {
  user: User | null;
  isPremium: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string) => void;
  logout: () => void;
  subscribe: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(detectLanguage());
  // Persist language selection in localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem('resilios_language');
    if (saved && saved in ({} as any)) {
      setLanguage(saved as Language);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('resilios_language', language);
  }, [language]);

  const login = (email: string) => {
    // Only allow Gmail addresses per product decision
    const normalized = email.trim();
    const isGmail = normalized.toLowerCase().endsWith('@gmail.com');
    if (!isGmail) {
      alert('Please sign in with a Gmail account to continue.');
      return;
    }
    const demoId = `user-${normalized.replace(/[^a-z0-9]/gi, '_')}`;
    // Query backend for premium status
    fetch(`/user/${demoId}/premium`).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setUser({ id: demoId, email: normalized, isPremium: data.is_premium });
      } else {
        setUser({ id: demoId, email: normalized, isPremium: false });
      }
    }).catch(() => {
      setUser({ id: demoId, email: normalized, isPremium: false });
    });
  };

  const logout = () => {
    // In a real app, this would call Firebase's signOut() method.
    setUser(null);
  };

  const subscribe = () => {
    // Create a checkout session on the server and redirect to Stripe Checkout.
    if (!user) return;
    fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          // If Stripe is not configured, suggest PayPal
          if (res.status === 501) {
            throw new Error('Stripe not configured. Please use PayPal to subscribe.');
          }
          throw new Error(txt || 'Failed to create checkout session');
        }
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      })
      .catch((err) => {
        console.error('Checkout error', err);
        alert(`Unable to start checkout: ${err.message || 'Try again later.'}`);
      });
  };

  // Poll backend for premium status periodically (in case webhook updates it)
  useEffect(() => {
    let id: number | undefined;
    if (user) {
      id = window.setInterval(() => {
        fetch(`/user/${user.id}/premium`).then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setUser((u) => (u ? { ...u, isPremium: data.is_premium } : u));
          }
        }).catch(() => {});
      }, 5000);
    }
    return () => { if (id) clearInterval(id); };
  }, [user]);


  const isPremium = user ? user.isPremium : false;

  return (
    <AuthContext.Provider value={{ user, isPremium, language, setLanguage, login, logout, subscribe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
