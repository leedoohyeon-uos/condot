import React, { useState, useRef } from 'react';
import { ArrowUp, Mic, Plus } from 'lucide-react';

interface HomeViewProps {
  onStartChat: (initialMessage: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartChat }) => {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && inputValue.trim()) {
      onStartChat(inputValue);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected File:', file);
    }
  };

  return (
    <div className="flex-1 h-full relative overflow-hidden flex flex-col items-center justify-center bg-[#F5F5F5]">
      
      {/* Constellation Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-40" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
            {/* Lines */}
            <line x1="280" y1="430" x2="330" y2="110" stroke="#FFD59E" strokeWidth="1" />
            <line x1="330" y1="110" x2="660" y2="210" stroke="#FFD59E" strokeWidth="1" />
            <line x1="660" y1="210" x2="820" y2="100" stroke="#FFD59E" strokeWidth="1" />
            <line x1="660" y1="210" x2="720" y2="380" stroke="#FFD59E" strokeWidth="1" />
            <line x1="720" y1="380" x2="900" y2="430" stroke="#FFD59E" strokeWidth="1" />
            <line x1="720" y1="380" x2="440" y2="270" stroke="#FFD59E" strokeWidth="1" />
            <line x1="440" y1="270" x2="280" y2="430" stroke="#FFD59E" strokeWidth="1" />
            <line x1="440" y1="270" x2="330" y2="110" stroke="#FFD59E" strokeWidth="1" />
            <line x1="440" y1="270" x2="600" y2="490" stroke="#FFD59E" strokeWidth="1" />
        </svg>
        
        {/* Glowing Nodes */}
        {/* Positions correspond roughly to the lines above */}
        <div className="absolute top-[11%] left-[33%] w-16 h-16 bg-orange-400 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-[43%] left-[28%] w-16 h-16 bg-orange-400 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-[27%] left-[44%] w-24 h-24 bg-orange-400 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-[21%] left-[66%] w-16 h-16 bg-orange-400 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-[10%] left-[82%] w-12 h-12 bg-orange-400 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-[38%] left-[72%] w-12 h-12 bg-orange-400 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-[43%] left-[90%] w-12 h-12 bg-orange-400 rounded-full blur-2xl opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 text-center w-full max-w-3xl px-6">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10 relative inline-block">
          TYPE YOUR EXPERIENCE<span className="text-brand-orange">.</span>
        </h2>

        {/* Input Bar */}
        <div className="bg-white rounded-full border border-gray-300 shadow-xl flex items-center px-2 py-3 transition-all focus-within:border-black focus-within:ring-1 focus-within:ring-black/5">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
            />
            <button 
              className="p-2 text-gray-400 hover:text-gray-800 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
                <Plus size={24} />
            </button>

            <input
                type="text"
                className="flex-1 bg-transparent outline-none px-2 text-base placeholder:text-gray-400 font-medium"
                placeholder="나 FLOW 창업경진대회에서 대상 탔어."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />

            <div className="flex items-center gap-2 mr-1">
                <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100">
                    <Mic size={20} />
                </button>
                <button 
                    onClick={() => inputValue.trim() && onStartChat(inputValue)}
                    disabled={!inputValue.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        inputValue.trim() 
                        ? 'bg-black text-white hover:scale-105' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <ArrowUp size={20} strokeWidth={3} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};