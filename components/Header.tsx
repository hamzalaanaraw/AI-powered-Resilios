
import React from 'react';
import { IMAGES } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full p-4 flex items-center shrink-0">
      <img src={IMAGES.logo} alt="Resilios Logo" className="h-10 w-10 mr-4 rounded-full"/>
      <div>
        <h1 className="text-xl font-bold text-sky-800">Resilios</h1>
        <p className="text-sm text-slate-500">Your AI Companion for Mental Wellness</p>
      </div>
    </header>
  );
};
