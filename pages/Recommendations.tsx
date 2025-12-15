import React, { useState } from 'react';
import { Compass, Lock, ToggleLeft, ToggleRight, Sparkles, Target, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Experience, GlobalConfig, CareerPrediction, CareerGapAnalysis } from '../types';
import { predictCareerPaths, analyzeCareerGap } from '../services/geminiService';

interface RecommendationsProps {
  experiences: Experience[];
  isAdmin: boolean;
  globalConfig: GlobalConfig;
  onToggleTestMode: () => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ experiences, isAdmin, globalConfig, onToggleTestMode }) => {
  // Local state to allow any user to "Try Test" for the current session
  const [isTrialActive, setIsTrialActive] = useState(false);
  
  const isAccessible = globalConfig.isTestMode || isAdmin || isTrialActive;

  // Feature State
  const [activeTab, setActiveTab] = useState<'forecast' | 'roadmap'>('forecast');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forecast Data
  const [predictions, setPredictions] = useState<CareerPrediction[]>([]);
  
  // Roadmap Data
  const [targetRole, setTargetRole] = useState('');
  const [gapAnalysis, setGapAnalysis] = useState<CareerGapAnalysis | null>(null);

  const handlePredict = async () => {
      if (experiences.length === 0) {
          alert("분석할 경험 데이터가 없습니다. 먼저 경험을 입력해주세요.");
          return;
      }
      setIsLoading(true);
      try {
          const result = await predictCareerPaths(experiences);
          setPredictions(result);
      } catch (e) {
          alert("분석 중 오류가 발생했습니다.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleGapAnalysis = async () => {
      if (!targetRole.trim()) {
          alert("목표 직무를 입력해주세요.");
          return;
      }
      setIsLoading(true);
      try {
          const result = await analyzeCareerGap(targetRole, experiences);
          setGapAnalysis(result);
      } catch (e) {
          alert("분석 중 오류가 발생했습니다.");
      } finally {
          setIsLoading(false);
      }
  };

  if (!isAccessible) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
               {/* Blurred Content Background */}
               <div className="absolute inset-0 opacity-20 blur-sm pointer-events-none p-10">
                   <h1 className="text-3xl font-bold mb-8">커리어 네비게이션</h1>
                   <div className="grid grid-cols-3 gap-6">
                       <div className="h-64 bg-gray-300 rounded-xl"></div>
                       <div className="h-64 bg-gray-300 rounded-xl"></div>
                       <div className="h-64 bg-gray-300 rounded-xl"></div>
                   </div>
               </div>

               {/* Overlay */}
               <div className="z-10 text-center bg-white/90 p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-md max-w-md">
                   <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
                       <Compass size={32} className="text-indigo-600"/>
                   </div>
                   <h2 className="text-3xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                   <p className="text-gray-500 mb-6">
                       AI 커리어 네비게이션 기능이 곧 출시됩니다.<br/>
                       나의 경험을 분석하여 미래 커리어를 예측해보세요.
                   </p>
                   <button 
                       onClick={() => setIsTrialActive(true)}
                       className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2 mx-auto animate-pulse"
                   >
                       <Sparkles size={16}/> Try Test (베타 체험하기)
                   </button>
               </div>
          </div>
      );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
       {/* Header */}
       <div className="p-8 pb-0 flex justify-between items-center">
           <div>
               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                   <Compass className="text-indigo-600"/> 커리어 네비게이션 <span className="text-sm font-normal bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Beta</span>
               </h1>
               <p className="text-gray-500 mt-2">나의 기록을 바탕으로 AI가 미래 커리어를 제안합니다.</p>
           </div>
           {isAdmin && (
               <button 
                onClick={onToggleTestMode}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-200 transition-colors"
               >
                   {globalConfig.isTestMode ? <ToggleRight size={24}/> : <ToggleLeft size={24}/>}
                   Test Mode: {globalConfig.isTestMode ? 'ON' : 'OFF'}
               </button>
           )}
       </div>

       {/* Tabs */}
       <div className="px-8 mt-6 border-b border-gray-200 flex gap-6">
           <button 
            onClick={() => setActiveTab('forecast')}
            className={`pb-3 font-bold text-lg transition-colors border-b-2 ${activeTab === 'forecast' ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
           >
               🚀 커리어 예측 (Forecast)
           </button>
           <button 
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 font-bold text-lg transition-colors border-b-2 ${activeTab === 'roadmap' ? 'text-orange-600 border-orange-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
           >
               🎯 목표 로드맵 (Gap Analysis)
           </button>
       </div>

       {/* Content */}
       <div className="flex-1 p-8 overflow-y-auto">
           {activeTab === 'forecast' && (
               <div className="max-w-6xl mx-auto">
                   {predictions.length === 0 ? (
                       <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                           <Sparkles size={48} className="mx-auto text-indigo-300 mb-4"/>
                           <h3 className="text-xl font-bold text-gray-900 mb-2">나의 커리어 가능성을 발견하세요</h3>
                           <p className="text-gray-500 mb-8">현재까지 입력된 {experiences.length}개의 경험 데이터를 분석합니다.</p>
                           <button 
                            onClick={handlePredict}
                            disabled={isLoading}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2 mx-auto disabled:opacity-70"
                           >
                               {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>}
                               {isLoading ? 'AI가 분석 중입니다...' : 'AI 커리어 예측 시작하기 (Try Test)'}
                           </button>
                       </div>
                   ) : (
                       <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                           {predictions.map((pred, idx) => (
                               <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                   <div className="flex justify-between items-start mb-4">
                                       <div className="bg-indigo-50 p-3 rounded-xl">
                                           <Target className="text-indigo-600" size={24}/>
                                       </div>
                                       <span className="text-2xl font-black text-indigo-600">{pred.compatibility}%</span>
                                   </div>
                                   <h3 className="text-xl font-bold text-gray-900 mb-3">{pred.role}</h3>
                                   <p className="text-gray-600 text-sm leading-relaxed mb-6 h-32 overflow-y-auto custom-scrollbar">
                                       {pred.reasoning}
                                   </p>
                                   <div className="bg-gray-50 p-4 rounded-xl">
                                       <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Recommended Next Steps</h4>
                                       <ul className="space-y-2">
                                           {pred.recommendedExperiences.map((rec, i) => (
                                               <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                   <span className="text-indigo-500 mt-1">•</span>
                                                   {rec}
                                               </li>
                                           ))}
                                       </ul>
                                   </div>
                               </div>
                           ))}
                           <div className="col-span-full mt-8 text-center">
                               <button 
                                onClick={() => setPredictions([])}
                                className="text-gray-400 hover:text-indigo-600 underline text-sm"
                               >
                                   다시 분석하기
                               </button>
                           </div>
                       </div>
                   )}
               </div>
           )}

           {activeTab === 'roadmap' && (
               <div className="max-w-4xl mx-auto">
                   {!gapAnalysis ? (
                       <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 text-center">
                           <Target size={48} className="mx-auto text-orange-300 mb-4"/>
                           <h3 className="text-xl font-bold text-gray-900 mb-6">목표 직무까지 무엇이 필요할까요?</h3>
                           <div className="flex max-w-lg mx-auto gap-3">
                               <input 
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="목표 직무를 입력하세요 (예: 서비스 기획자, 백엔드 개발자)"
                                className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                               />
                               <button 
                                onClick={handleGapAnalysis}
                                disabled={isLoading}
                                className="px-6 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-70 whitespace-nowrap"
                               >
                                   {isLoading ? <Loader2 className="animate-spin"/> : '로드맵 분석 (Try Test)'}
                               </button>
                           </div>
                       </div>
                   ) : (
                       <div className="animate-fade-in space-y-6">
                           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 text-center">
                               <span className="text-gray-500 font-medium">Target Role</span>
                               <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-6">{gapAnalysis.targetRole}</h2>
                               
                               <div className="grid md:grid-cols-2 gap-8 text-left">
                                   <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                       <h3 className="flex items-center gap-2 font-bold text-green-800 mb-4">
                                           <CheckCircle2 size={20}/> 현재 보유 역량 (Match)
                                       </h3>
                                       <ul className="space-y-2">
                                           {gapAnalysis.currentMatch.map((item, i) => (
                                               <li key={i} className="text-sm text-green-700 bg-white px-3 py-2 rounded-lg border border-green-100 shadow-sm">
                                                   {item}
                                               </li>
                                           ))}
                                       </ul>
                                   </div>
                                   <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                       <h3 className="flex items-center gap-2 font-bold text-red-800 mb-4">
                                           <AlertCircle size={20}/> 보완 필요 역량 (Missing)
                                       </h3>
                                       <ul className="space-y-2">
                                           {gapAnalysis.missingSkills.map((item, i) => (
                                               <li key={i} className="text-sm text-red-700 bg-white px-3 py-2 rounded-lg border border-red-100 shadow-sm">
                                                   {item}
                                               </li>
                                           ))}
                                       </ul>
                                   </div>
                               </div>
                           </div>

                           <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                               <h3 className="font-bold text-xl text-orange-900 mb-6 flex items-center gap-2">
                                   <ArrowRight className="bg-orange-200 rounded-full p-1"/> 
                                   Action Plan (To-Do List)
                               </h3>
                               <div className="space-y-3">
                                   {gapAnalysis.actionPlan.map((action, i) => (
                                       <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                                           <div className="bg-orange-100 text-orange-700 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                               {i + 1}
                                           </div>
                                           <p className="text-gray-800 mt-1">{action}</p>
                                       </div>
                                   ))}
                               </div>
                           </div>
                           
                           <div className="text-center pb-8">
                               <button 
                                onClick={() => setGapAnalysis(null)}
                                className="text-gray-400 hover:text-orange-600 underline text-sm"
                               >
                                   다른 직무 분석하기
                               </button>
                           </div>
                       </div>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};

export default Recommendations;