import React from 'react';
import { Sparkles, Palette } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Smart<span className="text-indigo-600">Match</span> AI
        </h1>
      </div>
      <p className="text-slate-500 max-w-md">
        Turn your headlines, copy, or ideas into perfectly matching illustrations instantly.
      </p>
    </header>
  );
};