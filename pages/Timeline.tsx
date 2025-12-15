import React, { useState, useMemo } from 'react';
import { Experience, FOLDER_COLORS } from '../types';
import { Filter, Star, ChevronDown, ChevronRight, Calendar } from 'lucide-react';

interface TimelineProps {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
}

const Timeline: React.FC<TimelineProps> = ({ experiences, onSelectExperience }) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // 1. Sort Descending by Date
  const sortedExperiences = useMemo(() => {
      return [...experiences].sort((a, b) => {
          // Robust parser for sorting
          const parse = (d: string) => {
              const m = d.match(/(\d{4})[\.\-\/년]?\s*(\d{1,2})?/);
              if(m) return parseInt(m[1]) * 100 + (m[2] ? parseInt(m[2]) : 1);
              return 0;
          };
          return parse(b.dateRange) - parse(a.dateRange);
      });
  }, [experiences]);

  // 2. Filter (Favorites only default)
  const displayedExperiences = useMemo(() => {
      return showAll ? sortedExperiences : sortedExperiences.filter(e => e.isFavorite);
  }, [sortedExperiences, showAll]);

  // 3. Group by Date (YYYY.MM)
  const groupedExperiences = useMemo(() => {
      const groups: Record<string, Experience[]> = {};
      displayedExperiences.forEach(exp => {
          // Extract Year.Month
          let key = 'Unknown';
          const match = exp.dateRange.match(/(\d{4})[\.\-\/년]?\s*(\d{1,2})?/);
          if (match) {
              key = `${match[1]}.${match[2] ? match[2].padStart(2, '0') : '01'}`;
          }
          if (!groups[key]) groups[key] = [];
          groups[key].push(exp);
      });
      return groups;
  }, [displayedExperiences]);

  // Sort group keys descending
  const sortedGroupKeys = Object.keys(groupedExperiences).sort((a, b) => b.localeCompare(a));

  return (
    <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-4 flex-shrink-0 z-10 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">커리어 타임라인</h2>
            <p className="text-gray-500">나의 경험을 시간 순으로 확인하세요.</p>
          </div>
          
          <button 
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm
                ${showAll ? 'bg-white text-gray-600 border border-gray-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}
            `}
          >
              {showAll ? <Filter size={16}/> : <Star size={16} fill="currentColor"/>}
              {showAll ? '전체 보기' : '즐겨찾기만 보기'}
          </button>
      </div>
      
      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto relative pl-8 md:pl-0 pb-20">
            
            {/* Vertical Central Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2"></div>

            {displayedExperiences.length === 0 && (
                <div className="text-center py-20 text-gray-400 relative z-10 bg-gray-50">
                    <p>{showAll ? '저장된 경험이 없습니다.' : '즐겨찾기한 경험이 없습니다.'}</p>
                </div>
            )}

            {sortedGroupKeys.map((dateKey, groupIndex) => {
                const groupItems = groupedExperiences[dateKey];
                const isGroupExpanded = expandedDate === dateKey; // Manual or hover expansion logic could go here
                
                return (
                    <div 
                        key={dateKey} 
                        className="relative mb-12"
                        onMouseEnter={() => setExpandedDate(dateKey)}
                        onMouseLeave={() => setExpandedDate(null)}
                    >
                        {/* Date Node on Axis */}
                        <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-orange-500 z-10 transform -translate-x-1/2 shadow-sm flex items-center justify-center">
                            {/* Optional: Add icon inside node if hover */}
                        </div>

                        {/* Date Label */}
                        <div className="absolute left-16 md:left-1/2 top-0 text-sm font-bold text-gray-500 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm border border-gray-100 transform md:translate-x-4 md:-translate-y-1">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {dateKey}</span>
                        </div>

                        {/* Cards for this Date */}
                        <div className="pt-6 space-y-4">
                            {groupItems.map((exp, idx) => {
                                const colorClass = FOLDER_COLORS[exp.category] || "bg-gray-50 text-gray-700 border-gray-200";
                                const borderColor = colorClass.split(' ').find(c => c.startsWith('border-')) || 'border-gray-200';
                                
                                // Layout logic: Even index Left, Odd index Right (relative to axis)
                                // But if grouped, maybe stack them? Let's use alternating for visual balance
                                const isRight = (groupIndex + idx) % 2 === 0;

                                return (
                                    <div 
                                        key={exp.id} 
                                        className={`relative flex md:items-center transition-all duration-300 ${isRight ? 'md:justify-start md:flex-row-reverse' : 'md:justify-start'}`}
                                    >
                                        {/* Connector Line */}
                                        <div className={`absolute h-px bg-gray-300 w-8 md:w-12 top-1/2 left-8 
                                            ${isRight ? 'md:left-auto md:right-1/2' : 'md:left-1/2'} 
                                        `}></div>

                                        {/* Card */}
                                        <div 
                                            className={`ml-16 md:ml-0 w-full md:w-[45%] bg-white p-5 rounded-2xl shadow-sm border-l-4 ${borderColor.replace('border-', 'border-l-')} 
                                            hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group relative
                                            ${expandedDate === dateKey ? 'scale-105 z-20 ring-2 ring-orange-100' : 'scale-100'}
                                            `}
                                            onClick={() => onSelectExperience(exp)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colorClass} bg-opacity-10`}>
                                                    {exp.category}
                                                </span>
                                                {exp.isFavorite && <span className="text-yellow-400">★</span>}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                                                {exp.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                                                {exp.summary}
                                            </p>
                                            
                                            {/* Attachments Indicator */}
                                            {exp.attachments && exp.attachments.length > 0 && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded w-fit mb-2">
                                                    <Paperclip size={12}/> {exp.attachments.length} 파일
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-1">
                                                {exp.keywords.slice(0, 3).map(k => (
                                                    <span key={k} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded">#{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            
            {/* End Node */}
            <div className="absolute left-8 md:left-1/2 bottom-0 w-3 h-3 rounded-full bg-gray-300 transform -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;