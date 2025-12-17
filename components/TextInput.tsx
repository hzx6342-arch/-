import React, { useState } from 'react';
import { Wand2, XCircle } from 'lucide-react';
import { GenerationStatus } from '../types';

interface TextInputProps {
  onGenerate: (text: string, style: string) => void;
  status: GenerationStatus;
}

const STYLES = [
  { id: 'Auto', label: '✨ 智能匹配', value: 'Auto' },
  { id: 'Photographic', label: '📸 摄影写实', value: 'Photorealistic Photography, 8k, highly detailed' },
  { id: 'Cinematic', label: '🎬 电影质感', value: 'Cinematic, movie scene, dramatic lighting, 8k' },
  { id: 'Anime', label: '🌸 日系动漫', value: 'Japanese Anime Style, vibrant colors, detailed' },
  { id: '3D Render', label: '🧊 3D渲染', value: '3D Render, Unreal Engine 5, Octane Render, isometric' },
  { id: 'Watercolor', label: '🎨 水墨水彩', value: 'Artistic Watercolor painting, soft edges, ethereal' },
  { id: 'Minimalist', label: '⚪ 极简主义', value: 'Minimalist Vector Art, flat design, clean lines' },
  { id: 'Cyberpunk', label: '🌃 赛博朋克', value: 'Cyberpunk, neon lights, futuristic city, high contrast' },
];

export const TextInput: React.FC<TextInputProps> = ({ onGenerate, status }) => {
  const [text, setText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && (status === GenerationStatus.IDLE || status === GenerationStatus.SUCCESS || status === GenerationStatus.ERROR)) {
      onGenerate(text.trim(), selectedStyle.value);
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
            文案 / 标题 (Your Copy)
          </label>
          
          <div className="relative mb-4">
            <textarea
              id="prompt-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例如：提升睡眠质量的五个小技巧..."
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

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              选择风格 (Style)
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  disabled={isProcessing}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                    ${selectedStyle.id === style.id 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}
                  `}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
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
              {isProcessing ? 'Generating Image...' : '生成图片 (Generate Image)'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};