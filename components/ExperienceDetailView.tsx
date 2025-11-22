import React from 'react';
import { ExperienceCardData, CATEGORIES } from '../types';
import { ArrowLeft, Calendar, MapPin, Sparkles, ChevronDown, Award, Tag, User, BookOpen, CheckCircle2 } from 'lucide-react';

interface ExperienceDetailViewProps {
  card: ExperienceCardData;
  onBack: () => void;
}

export const ExperienceDetailView: React.FC<ExperienceDetailViewProps> = ({ card, onBack }) => {
  const categoryDef = CATEGORIES.find(c => c.id === card.category) || CATEGORIES[CATEGORIES.length - 1];
  const baseColor = categoryDef.hex;

  // Mocking AI-expanded data if specific fields aren't present in the generic structure
  // In a real app, this would come from the backend/LLM. 
  // For the "Mongolia" demo, we hardcode the structure if it matches, otherwise we map generic fields.
  
  const isMongoliaDemo = card.title.includes('몽골');

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode, isAiEnhanced = false) => (
    <div className="mb-8 group">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-md ${isAiEnhanced ? 'bg-brand-accent/20 text-brand-orange' : 'bg-gray-100 text-gray-600'}`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {title}
          {isAiEnhanced && (
            <span className="px-2 py-0.5 rounded-full bg-brand-accent/30 text-brand-orange text-[10px] font-bold flex items-center gap-1 border border-brand-accent/40">
               <Sparkles size={10} fill="currentColor" /> AI 보완
            </span>
          )}
        </h3>
      </div>
      <div className={`pl-2 border-l-2 ${isAiEnhanced ? 'border-brand-accent/50' : 'border-gray-200'} ml-3.5 py-1`}>
         <div className={`pl-4 ${isAiEnhanced ? 'p-4 bg-brand-accent/5 rounded-r-xl rounded-bl-xl' : ''}`}>
            {content}
         </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-full bg-[#F5F5F5] p-6 md:p-10 overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl min-h-full overflow-hidden border border-gray-100">
        
        {/* Header with Color Banner */}
        <div className="relative">
            <div className="h-32 w-full opacity-20" style={{ backgroundColor: baseColor }}></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white"></div>
            
            <div className="absolute top-8 left-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm text-gray-700 font-bold text-sm border border-gray-200"
                >
                    <ArrowLeft size={16} />
                    목록으로
                </button>
            </div>

            <div className="px-10 -mt-10 relative pb-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <span 
                            className="inline-block px-3 py-1 rounded-lg text-sm font-bold mb-4 shadow-sm"
                            style={{ backgroundColor: `${baseColor}40`, color: '#333' }}
                        >
                            {categoryDef.name}
                        </span>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
                            {card.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                             <div className="flex items-center gap-2">
                                 <Calendar size={16} />
                                 25.07.05 ~ 25.07.18
                             </div>
                             {isMongoliaDemo && (
                                 <div className="flex items-center gap-2">
                                     <MapPin size={16} />
                                     울란바토르 · 인근 지역 초등학교
                                 </div>
                             )}
                        </div>
                    </div>
                    
                    {/* Top Right Status Indicators */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-10 space-y-2">
            
            {/* 1. Summary Section */}
            {renderSection(
                '한줄요약', 
                <CheckCircle2 size={18} />,
                <ul className="space-y-2 text-gray-700 font-medium leading-relaxed">
                    {isMongoliaDemo ? (
                        <li className="flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                            디자인팀장 + 태권도 교육 + 총장상 수상한 해외 봉사 프로젝트
                        </li>
                    ) : (
                        <li className="flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                            {card.fields.find(f => f.label.includes('요약') || f.label.includes('내용'))?.value || "내용 없음"}
                        </li>
                    )}
                </ul>
            )}

            {/* 2. Type/Tags Section */}
            {renderSection(
                '유형', 
                <Tag size={18} />,
                <div className="flex flex-wrap gap-2">
                    {isMongoliaDemo ? (
                        ['해외봉사', '교육봉사', '디자인', '리더십'].map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold">#{tag}</span>
                        ))
                    ) : (
                         <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold">#{categoryDef.name}</span>
                    )}
                </div>
            )}

            {/* 3. Role Section */}
            {renderSection(
                '역할', 
                <User size={18} />,
                <ul className="space-y-3 text-gray-700 leading-relaxed">
                    {isMongoliaDemo ? (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                                <span>
                                    <strong className="text-gray-900">디자인팀장</strong>
                                    (단체복, 책자, 스티커, 명찰 제작 총괄) - 팀원 4명 리딩 및 일정 관리
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                                <span>
                                    <strong className="text-gray-900">팀티라노</strong>
                                    (태권도 교육 진행) - 현지 아동 대상 품새 및 격파 시범 교육 담당
                                </span>
                            </li>
                        </>
                    ) : (
                         <li className="flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                            {card.fields.find(f => f.label.includes('역할'))?.value || "내용 없음"}
                        </li>
                    )}
                </ul>
            )}

            {/* 4. Achievements Section (AI Enhanced) */}
            {renderSection(
                '성과', 
                <Award size={18} />,
                <ul className="space-y-3 text-gray-800 leading-relaxed font-medium">
                    {isMongoliaDemo ? (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                                우수활동상(총장상) 수상
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                                교육 참여 아동 <strong className="text-brand-orange">120명 이상</strong> 달성 (목표 대비 120%)
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                                봉사단 홍보물 4종(책자, 단체복, 현수막, 굿즈) 제작 완료 및 배포
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                                총 <strong className="text-brand-orange">수업 8회</strong> 안정적 운영, 현지 학교 만족도 조사 '매우 우수' 획득
                            </li>
                        </>
                    ) : (
                        <li className="flex items-start gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                            {card.fields.find(f => f.label.includes('성과'))?.value || "AI가 성과를 분석 중입니다..."}
                        </li>
                    )}
                </ul>,
                true // AI Enhanced Flag
            )}

            {/* 5. Learnings Section (AI Enhanced) */}
            {renderSection(
                '배운점 / 느낀점', 
                <BookOpen size={18} />,
                <ul className="space-y-3 text-gray-700 leading-relaxed">
                    {isMongoliaDemo ? (
                        <>
                             <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                                디자인 리더십을 실제 현장에서 적용해본 첫 경험을 통해, 팀원 간 의견 조율의 중요성을 체득함.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                                언어 장벽을 넘는 비언어적 교육(태권도)의 강점을 체감하며, 글로벌 커뮤니케이션 역량을 배양함.
                            </li>
                             <li className="flex items-start gap-2">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                                제한된 자원과 낯선 환경(울란바토르) 속에서도 프로젝트를 완수하는 문제해결 능력을 기름.
                            </li>
                        </>
                    ) : (
                        <li className="flex items-start gap-2">
                             <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                             이 경험을 통해 얻은 직무 관련 인사이트를 AI가 정리하고 있습니다.
                        </li>
                    )}
                </ul>,
                true // AI Enhanced Flag
            )}

        </div>
      </div>
    </div>
  );
};
