
import React from 'react';
import { ArrowRight, Sparkles, Mic } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden cursor-pointer" onClick={onLoginClick}>
      {/* Background Visuals */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 to-white z-0 pointer-events-none" />
      
      {/* Content mimicking MainInput but static */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen max-w-4xl mx-auto px-4 pointer-events-none">
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-2">
            <Sparkles className="text-orange-600 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">어떤 경험을 하셨나요?</h2>
          <p className="text-gray-500 text-lg">한 줄의 경험을 입력하면 AI가 자동으로 분류하고 구조화하여 아카이빙합니다.</p>
        </div>

        <div className="w-full relative opacity-80">
          <div className="relative group">
            <div
              className="w-full p-6 pr-32 text-lg border-2 border-gray-200 rounded-3xl shadow-sm bg-white h-32 leading-relaxed text-gray-400"
            >
                2024.03 - 2024.06: 교내 알고리즘 동아리 회장으로서 매주 스터디를 주최하고...
            </div>
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <div className="p-3 text-gray-400 bg-gray-50 rounded-full">
                    <Mic size={20} />
                </div>
                <div className="p-3 rounded-2xl bg-gray-900 text-white shadow-lg">
                    <ArrowRight size={24} />
                </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3 opacity-60">
            {["#캡스톤디자인 대상 수상", "#하계 인턴십 2개월", "#교내 축구 동아리 총무"].map((tag) => (
            <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
                {tag}
            </span>
            ))}
        </div>
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
          <div className="bg-white/90 px-8 py-4 rounded-full shadow-xl border border-white/50 animate-bounce">
              <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  👆 화면을 클릭하여 로그인하고 시작하세요
              </span>
          </div>
      </div>
    </div>
  );
};

export default LandingPage;
