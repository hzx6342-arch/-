import React from 'react';
import { Download, Share2, Info, RefreshCw } from 'lucide-react';
import { GeneratedResult, GenerationStatus } from '../types';

interface ResultDisplayProps {
  result: GeneratedResult | null;
  status: GenerationStatus;
  onRetry: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, status, onRetry }) => {
  if (status === GenerationStatus.IDLE && !result) return null;

  const handleDownload = () => {
    if (!result?.imageDataUrl) return;
    const link = document.createElement('a');
    link.href = result.imageDataUrl;
    link.download = `smart-match-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 mb-20">
      
      {/* Loading State */}
      {(status === GenerationStatus.OPTIMIZING || status === GenerationStatus.GENERATING) && (
        <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-2xl border border-slate-200 backdrop-blur-sm animate-pulse">
          <div className="w-64 h-64 bg-slate-200 rounded-xl mb-6 flex items-center justify-center">
             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-slate-700">
            {status === GenerationStatus.OPTIMIZING 
              ? "Analyzing your text's mood & style..." 
              : "Painting your vision with pixels..."}
          </p>
          <p className="text-sm text-slate-500 mt-2">This usually takes about 5-10 seconds</p>
        </div>
      )}

      {/* Result State */}
      {status === GenerationStatus.SUCCESS && result && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row">
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-slate-100 relative group min-h-[400px]">
              <img 
                src={result.imageDataUrl} 
                alt="AI Generated" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
                <button 
                  onClick={handleDownload}
                  className="bg-white text-slate-900 px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2 hover:bg-slate-50 transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                    Smart Match
                  </span>
                </div>
                
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Original Copy</h3>
                <p className="text-slate-800 text-lg font-medium mb-6 italic border-l-4 border-indigo-500 pl-4">
                  "{result.originalText}"
                </p>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">AI Visual Logic</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {result.optimizedPrompt}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-400 text-xs">Generated with Gemini</span>
                <button 
                  onClick={onRetry} // In a real app, this might re-trigger with same seed or different
                  className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" /> Try different style
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};