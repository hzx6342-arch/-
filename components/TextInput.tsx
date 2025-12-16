import React, { useState, useCallback } from 'react';
import { Wand2, XCircle } from 'lucide-react';
import { GenerationStatus } from '../types';

interface TextInputProps {
  onGenerate: (text: string) => void;
  status: GenerationStatus;
}

export const TextInput: React.FC<TextInputProps> = ({ onGenerate, status }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && status === GenerationStatus.IDLE || status === GenerationStatus.SUCCESS || status === GenerationStatus.ERROR) {
      onGenerate(text.trim());
    }
  };

  const handleClear = () => setText('');

  const isProcessing = status === GenerationStatus.OPTIMIZING || status === GenerationStatus.GENERATING;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white rounded-xl shadow-xl p-6 border border-slate-100">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-700 mb-2">
            Your Copy / Headline
          </label>
          
          <div className="relative">
            <textarea
              id="prompt-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Five tips to improve your sleep quality..."
              className="w-full h-32 p-4 text-slate-800 bg-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400"
              disabled={isProcessing}
            />
            {text && !isProcessing && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              {text.length} characters
            </span>
            <button
              type="submit"
              disabled={!text.trim() || isProcessing}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all transform active:scale-95
                ${!text.trim() || isProcessing 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}
              `}
            >
              <Wand2 className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Creating Magic...' : 'Generate Image'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};