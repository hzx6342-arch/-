import React, { useState } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { ResultDisplay } from './components/ResultDisplay';
import { optimizePrompt, generateImage } from './services/geminiService';
import { GenerationStatus, GeneratedResult, AppError } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const handleGenerate = async (originalText: string, style: string) => {
    setStatus(GenerationStatus.OPTIMIZING);
    setError(null);
    setResult(null);

    try {
      // Step 1: Optimize text for image generation (Text -> Descriptive Prompt)
      const optimizedPrompt = await optimizePrompt(originalText, style);
      
      setStatus(GenerationStatus.GENERATING);
      
      // Step 2: Generate the image (Descriptive Prompt -> Image)
      const imageDataUrl = await generateImage(optimizedPrompt);

      setResult({
        originalText,
        optimizedPrompt,
        imageDataUrl,
        timestamp: Date.now(),
        style
      });
      setStatus(GenerationStatus.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setError({
        message: err.message || "An unexpected error occurred. Please try again."
      });
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleRetry = () => {
    if (result) {
      handleGenerate(result.originalText, result.style);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex flex-col">
      <Header />
      
      <main className="flex-grow w-full max-w-6xl mx-auto flex flex-col items-center">
        <TextInput onGenerate={handleGenerate} status={status} />
        
        {status === GenerationStatus.ERROR && error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error.message}</p>
          </div>
        )}

        <ResultDisplay result={result} status={status} onRetry={handleRetry} />
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} SmartMatch AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;