import React, { useState } from 'react';
import { RefreshCw, Save, Send, Sparkles } from 'lucide-react';
import { Experience, FOLDER_COLORS } from '../types';

interface CardGenerationProps {
  experience: Experience | null;
  onRegenerate: () => void;
  onModify: (instruction: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CardGeneration: React.FC<CardGenerationProps> = ({ experience, onRegenerate, onModify, onSave, onCancel, isLoading }) => {
  const [modificationInput, setModificationInput] = useState("");

  if (!experience) return null;

  const colorClass = FOLDER_COLORS[experience.category] || FOLDER_COLORS.기타;

  const handleModifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modificationInput.trim()) {
      onModify(modificationInput);
      setModificationInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">경험 카드가 생성되었습니다</h2>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-5xl px-4">
        {/* Card Preview */}
        <div className="flex-1 w-full flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-md transition-all duration-500">
                <div className={`h-3 w-full ${colorClass.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colorClass}`}>
                    {experience.category}
                    </span>
                    <span className="text-sm text-gray-400 font-mono">{experience.dateRange}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{experience.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{experience.summary}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {experience.keywords.slice(0, 4).map((kw, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md border border-gray-100">
                        #{kw}
                    </span>
                    ))}
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="font-semibold text-gray-900 mr-2">역할:</span> {experience.content.role}
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* Modification Chat & Actions */}
        <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <div className="mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-orange-500"/>
                    AI와 대화하며 수정하기
                </h3>
                <p className="text-sm text-gray-500 mt-1">내용이 마음에 들지 않나요? 원하는 수정사항을 말해주세요.</p>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm text-gray-600 min-h-[100px] max-h-[200px] overflow-y-auto">
                 <p className="mb-2">💡 예시:</p>
                 <ul className="list-disc pl-5 space-y-1">
                     <li>"키워드에 '리더십'을 추가해줘."</li>
                     <li>"요약 내용을 조금 더 전문적으로 바꿔줘."</li>
                     <li>"날짜를 2024년 8월로 변경해줘."</li>
                 </ul>
             </div>

             <form onSubmit={handleModifySubmit} className="flex gap-2 mb-6 relative">
                 <input 
                    type="text" 
                    value={modificationInput}
                    onChange={(e) => setModificationInput(e.target.value)}
                    placeholder="수정할 내용을 입력하세요..."
                    className="flex-1 p-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                    disabled={isLoading}
                 />
                 <button 
                    type="submit" 
                    disabled={isLoading || !modificationInput.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-gray-900 text-white rounded-lg hover:bg-black disabled:bg-gray-300"
                 >
                    {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                 </button>
             </form>

             <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
                 <button 
                    onClick={onSave}
                    className="w-full flex justify-center items-center gap-2 px-8 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-medium transition-all shadow-md"
                 >
                    <Save size={18} />
                    이대로 저장하기
                 </button>
                 <div className="flex gap-3">
                    <button 
                        onClick={onRegenerate}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm"
                    >
                        처음부터 다시 생성
                    </button>
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm"
                    >
                        취소하고 나가기
                    </button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CardGeneration;