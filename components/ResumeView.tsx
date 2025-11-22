import React, { useState } from 'react';
import { Building2, User, FileText, Bookmark, Search, Loader2 } from 'lucide-react';

// --- Backend Simulation Types & Data ---

interface CoverLetterData {
  id: number;
  companyName: string;
  jobTitle: string;
  formatYear: string;
  employmentType: string; // '신입' | '인턴' | '경력'
  questions: string[]; // List of cover letter questions
  answerSnippet: string; // Mock content for the preview
  tags: string[];
}

// Mock Database acting as the "Backend" source
const MOCK_DB: CoverLetterData[] = [
  {
    id: 1,
    companyName: '현대자동차',
    jobTitle: 'R&D / 차량설계',
    formatYear: '2023 하반기',
    employmentType: '신입',
    questions: [
      '본인이 회사를 선택할 때의 기준은 무엇이며, 왜 현대자동차생산법인이 그 기준에 적합한지를 기술해 주십시오.',
      '본인이 지원한 직무에 적합하다고 생각하는 이유와, 입사 후 포부를 기술해 주십시오.'
    ],
    answerSnippet: '제가 회사를 선택하는 가장 중요한 기준은 "지속 가능한 성장"과 "혁신을 향한 끊임없는 도전"입니다. 현대자동차는 전기차 및 수소차 분야에서 글로벌 리더십을 확보하며, 단순한 이동 수단을 넘어 스마트 모빌리티 솔루션 기업으로 도약하고 있습니다. 이러한 비전은 제가 추구하는 엔지니어로서의 성장 방향성과 일치합니다...',
    tags: ['합격자소서', '직무역량', '도전정신']
  },
  {
    id: 2,
    companyName: '삼성전자',
    jobTitle: 'DX부문 / SW개발',
    formatYear: '2024 상반기',
    employmentType: '신입',
    questions: [
      '삼성전자를 지원한 이유와 입사 후 회사에서 이루고 싶은 꿈을 기술하십시오.',
      '본인의 성장과정을 간략히 기술하되 현재의 자신에게 가장 큰 영향을 끼친 사건, 인물 등을 포함하여 기술하시기 바랍니다.'
    ],
    answerSnippet: '소프트웨어 기술을 통해 전 세계 사용자의 일상을 혁신하고 싶습니다. 삼성전자는 모바일, 가전, 네트워크 등 다양한 도메인에서 초연결 경험을 제공하고 있습니다. 저는 학부 시절 IoT 프로젝트를 수행하며 기기 간 연결성을 높이는 미들웨어를 개발한 경험이 있으며...',
    tags: ['합격자소서', '지원동기', '포부']
  },
  {
    id: 3,
    companyName: 'LG전자',
    jobTitle: 'H&A본부 / 기구설계',
    formatYear: '2023 하반기',
    employmentType: '인턴',
    questions: [
      '지원 직무와 관련된 본인의 강점과 이를 돋보이게 했던 경험을 구체적으로 기술해 주십시오.',
      'LG전자 입사 후 이루고 싶은 나만의 꿈과 비전을 기술해 주십시오.'
    ],
    answerSnippet: '기구 설계 직무에서 필수적인 역량은 "설계 디테일"과 "협업 능력"이라고 생각합니다. 캡스톤 디자인 프로젝트에서 자율주행 로봇의 외형을 설계할 때, 센서 부착 위치에 따른 간섭 문제를 해결하기 위해 3D 모델링을 수십 차례 수정하고 팀원들과 논의하며 최적의 설계를 도출했습니다...',
    tags: ['합격자소서', '직무강점', '협업']
  },
  {
    id: 4,
    companyName: '네이버',
    jobTitle: 'Service Backend',
    formatYear: '2023 상반기',
    employmentType: '신입',
    questions: [
      '자신이 가장 깊이 있게 파고들었던 기술적 경험에 대해 설명해 주세요.',
      '동료와 협업하며 겪었던 갈등 상황과 이를 해결하기 위해 노력한 경험을 서술해 주세요.'
    ],
    answerSnippet: '대규모 트래픽 처리를 위한 분산 시스템 설계에 깊은 관심을 가지고 있습니다. 오픈소스 프로젝트에 기여하며 Kafka를 활용한 이벤트 기반 아키텍처를 구현해본 경험이 있습니다. 당시 메시지 유실 문제를 해결하기 위해...',
    tags: ['합격자소서', '기술역량', '문제해결']
  },
  {
    id: 5,
    companyName: '카카오',
    jobTitle: '비즈니스 기획',
    formatYear: '2024 상반기',
    employmentType: '인턴',
    questions: [
      '카카오의 서비스 중 하나를 선택하여 장단점을 분석하고, 개선안을 제안해 주세요.',
      '남들과 다른 시각으로 문제를 해결했던 경험에 대해 기술해 주세요.'
    ],
    answerSnippet: '카카오톡의 "선물하기" 기능을 분석하며, 단순한 상품 전달을 넘어 "감정 전달"의 매개체로서의 가능성을 보았습니다. 다만, 받는 사람의 취향을 고려하지 못한 선물이 오가는 페인포인트를 발견하고, 이를 해결하기 위해 위시리스트 기반 추천 기능을 제안합니다...',
    tags: ['서비스기획', '분석력', '창의성']
  },
  {
    id: 6,
    companyName: 'SK하이닉스',
    jobTitle: '양산/기술',
    formatYear: '2023 하반기',
    employmentType: '신입',
    questions: [
      '지원 분야에 필요한 역량을 키우기 위해 노력한 경험과, 그 과정에서 겪은 어려움을 어떻게 극복했는지 기술해 주세요.',
      'SK하이닉스에 지원하게 된 동기와 입사 후 포부에 대해 기술해 주세요.'
    ],
    answerSnippet: '반도체 공정 실습을 통해 8대 공정에 대한 이론적 지식을 실무에 적용해 보았습니다. 특히 포토 공정에서 발생한 패턴 불량 문제를 해결하기 위해 변수들을 통제하며 실험을 반복했고, 결국 최적의 노광 시간을 찾아내어 수율을 15% 향상시켰습니다...',
    tags: ['합격자소서', '직무경험', '끈기']
  }
];

// Mock API Service
const mockSearchApi = async (company: string, job: string, keyword: string): Promise<CoverLetterData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_DB.filter(item => {
        const matchCompany = company ? item.companyName.includes(company) : true;
        const matchJob = job ? item.jobTitle.includes(job) : true;
        const matchKeyword = keyword ? (
          item.questions.some(q => q.includes(keyword)) || 
          item.answerSnippet.includes(keyword) ||
          item.tags.some(t => t.includes(keyword))
        ) : true;
        return matchCompany && matchJob && matchKeyword;
      });
      
      // Sort by recency (descending year)
      results.sort((a, b) => b.formatYear.localeCompare(a.formatYear));
      
      resolve(results);
    }, 600); // Simulate 600ms network latency
  });
};

// --- Component ---

export const ResumeView: React.FC = () => {
  const primaryColor = '#F1881A'; 
  
  // State
  const [companyInput, setCompanyInput] = useState('');
  const [jobInput, setJobInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [results, setResults] = useState<CoverLetterData[]>(MOCK_DB.slice(0, 3)); // Initial view
  const [isSearchActive, setIsSearchActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('전체');

  const handleSearch = async () => {
    setIsLoading(true);
    setIsSearchActive(true);
    try {
      const data = await mockSearchApi(companyInput, jobInput, keywordInput);
      setResults(data);
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const keywords = ['배달의민족', '삼성전자', '삼성물산', '포스코', 'LG전자', '삼성증권'];

  return (
    <div className="flex-1 h-full bg-[#F5F5F5] p-6 md:p-10 overflow-y-auto font-sans">
      <div className="max-w-6xl mx-auto">
         {/* Breadcrumb */}
         <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
           <span>자소서 도우미</span>
           <span className="text-gray-300">&gt;</span>
           <span className="font-bold text-gray-800">자소서 검색기</span>
         </div>

         {/* Main Search Container */}
         <div 
            className="rounded-[32px] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden"
            style={{ backgroundColor: primaryColor }}
         >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="mb-10">
                    <h2 className="text-xl font-medium opacity-90 mb-2">자소서 검색기</h2>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-snug">
                        무엇이든 검색해보세요.<br/>
                        딱 맞는 합격 자소사가 3초 만에 나옵니다.
                    </h1>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-8 text-base font-medium mb-6 border-b border-white/20 pb-1">
                    {['전체', '대기업', '공기업', '은행권', '인턴'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`pb-3 relative transition-all hover:opacity-100 ${selectedTab === tab ? 'opacity-100 font-bold' : 'opacity-70'}`}
                        >
                            {tab}
                            {selectedTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                {/* Search Inputs Row */}
                <div className="flex flex-col lg:flex-row gap-3 mb-8">
                    <div className="flex-1 bg-white h-16 rounded-2xl flex items-center px-5 shadow-lg focus-within:ring-4 focus-within:ring-black/5 transition-all group">
                        <Building2 className="text-gray-400 mr-3 group-focus-within:text-[#F1881A] transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="기업명" 
                          className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 h-full text-base" 
                          value={companyInput}
                          onChange={(e) => setCompanyInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="flex-1 bg-white h-16 rounded-2xl flex items-center px-5 shadow-lg focus-within:ring-4 focus-within:ring-black/5 transition-all group">
                        <User className="text-gray-400 mr-3 group-focus-within:text-[#F1881A] transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="직무" 
                          className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 h-full text-base"
                          value={jobInput}
                          onChange={(e) => setJobInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="flex-[1.2] bg-white h-16 rounded-2xl flex items-center px-5 shadow-lg focus-within:ring-4 focus-within:ring-black/5 transition-all group">
                        <FileText className="text-gray-400 mr-3 group-focus-within:text-[#F1881A] transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="자소서 항목, 내용 등 키워드" 
                          className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 h-full text-base"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button 
                        className="bg-[#222] hover:bg-black text-white h-16 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap disabled:bg-gray-700"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} strokeWidth={3} />}
                        검색
                    </button>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold mr-2 text-white/90">추천검색어</span>
                    {keywords.map(k => (
                        <button 
                          key={k} 
                          onClick={() => { setCompanyInput(k); handleSearch(); }}
                          className="bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg text-white backdrop-blur-sm transition-colors border border-white/10 font-medium"
                        >
                            #{k}
                        </button>
                    ))}
                </div>
            </div>
         </div>

         {/* Results Section */}
         {isSearchActive && (
             <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        검색 결과 <span className="text-[#F1881A]">{results.length}</span>건
                    </h3>
                    <div className="flex gap-3 text-sm text-gray-500 bg-white rounded-lg p-1 border border-gray-100">
                        <button className="font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-md shadow-sm">최신순</button>
                        <button className="hover:text-gray-800 px-3 py-1">정확도순</button>
                    </div>
                 </div>

                 {isLoading ? (
                   <div className="flex justify-center items-center py-20">
                      <Loader2 className="animate-spin text-[#F1881A]" size={40} />
                   </div>
                 ) : results.length === 0 ? (
                   <div className="text-center py-20 text-gray-400">
                     <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                     <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
                   </div>
                 ) : (
                   <div className="grid gap-5">
                       {results.map(result => (
                           <div key={result.id} className="bg-white rounded-[24px] p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200/50 transition-all cursor-pointer group relative overflow-hidden">
                               <div className="absolute top-0 left-0 w-1 h-full bg-[#F1881A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                               
                               <div className="flex justify-between items-start mb-4">
                                   <div className="flex items-center gap-2">
                                       <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">{result.formatYear}</span>
                                       <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">{result.employmentType}</span>
                                   </div>
                                   <button className="text-gray-300 hover:text-[#F1881A] transition-colors p-1">
                                      <Bookmark size={22} />
                                   </button>
                               </div>
                               
                               <div className="flex items-center gap-3 mb-2">
                                   <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#F1881A] transition-colors">{result.companyName}</h4>
                                   <span className="text-gray-300">|</span>
                                   <span className="text-gray-600 font-medium">{result.jobTitle}</span>
                               </div>

                               <div className="mb-5">
                                   <p className="text-gray-900 font-bold text-sm mb-1.5 line-clamp-1 before:content-['Q.'] before:mr-1 before:text-[#F1881A]">
                                      {result.questions[0]}
                                   </p>
                                   <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                       {result.answerSnippet}
                                   </p>
                               </div>

                               <div className="flex items-center gap-2 border-t border-gray-50 pt-4">
                                   {result.tags.map(tag => (
                                       <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-100 font-medium">#{tag}</span>
                                   ))}
                               </div>
                           </div>
                       ))}
                   </div>
                 )}

                 {/* Load More Button (Only show if we have results) */}
                 {results.length > 0 && !isLoading && (
                    <div className="mt-8 flex justify-center">
                        <button className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-sm">
                            결과 더보기
                        </button>
                    </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
}