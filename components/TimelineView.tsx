import React, { useMemo } from 'react';
import { ExperienceCardData, CATEGORIES, TimelineItem } from '../types';

interface TimelineViewProps {
  cards: ExperienceCardData[]; // Requirement 1: Use cards as source
  onFolderClick: (categoryId: string) => void; // Requirement 3: Split handlers
  onTitleClick: (cardId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ cards, onFolderClick, onTitleClick }) => {
  
  // Derive timeline items directly from cards
  const items: TimelineItem[] = useMemo(() => {
    return cards.map(card => ({
        id: card.id,
        year: card.date ? parseInt('20' + card.date.split('.')[0]) : new Date().getFullYear(),
        date: card.date,
        title: card.title, // Or derive summary here if needed
        categoryId: card.category
    }));
  }, [cards]);

  // Group items by year
  const groupedData = useMemo(() => {
    const groups: Record<number, TimelineItem[]> = {};
    items.forEach(item => {
        if (!groups[item.year]) groups[item.year] = [];
        groups[item.year].push(item);
    });
    
    const years = Object.keys(groups).map(Number).sort((a, b) => b - a);
    
    return years.map(year => ({
        year,
        items: groups[year].sort((a, b) => a.date.localeCompare(b.date)) 
    }));
  }, [items]);

  const getCategoryHex = (catId: string) => {
      const cat = CATEGORIES.find(c => c.id === catId);
      return cat ? cat.hex : '#ccc';
  };

  return (
    <div className="flex-1 h-full bg-[#F5F5F5] overflow-y-auto p-10">
      <div className="max-w-4xl mx-auto">
        
        {groupedData.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                 <h3 className="text-xl font-bold mb-2">타임라인이 비어있습니다.</h3>
                 <p>채팅을 통해 경험을 추가해보세요!</p>
             </div>
        ) : (
            groupedData.map((group, index) => (
            <div key={group.year} className="flex mb-16 relative">
                
                {/* Left: Year */}
                <div className="w-32 pt-2 shrink-0 text-right pr-10">
                <h2 className="text-4xl font-black tracking-tighter">{group.year}</h2>
                </div>

                {/* Center: Line & Dot */}
                <div className="relative flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-[3px] border-orange-400 bg-orange-500 shadow-md z-10 shrink-0"></div>
                    <div className={`w-[2px] bg-gray-300 absolute top-8 left-1/2 -translate-x-1/2 ${index === groupedData.length - 1 ? 'h-[calc(100%+30px)]' : 'bottom-[-64px]'}`}></div>
                </div>

                {/* Right: Items */}
                <div className="flex-1 pl-10 pt-2 space-y-6 pb-4">
                    {group.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                            {/* Folder Icon - Clickable */}
                            <button 
                                onClick={() => onFolderClick(item.categoryId)}
                                className="shrink-0 w-8 h-6 rounded relative shadow-sm hover:scale-110 transition-transform cursor-pointer" 
                                style={{ backgroundColor: getCategoryHex(item.categoryId) }}
                                title="폴더로 이동"
                            >
                                <div className="absolute -top-1 left-0 w-3 h-2 rounded-t bg-inherit opacity-80"></div>
                            </button>
                            
                            {/* Text Content - Clickable Title */}
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                                <button 
                                    onClick={() => onTitleClick(item.id)}
                                    className="text-lg font-bold text-gray-800 hover:text-orange-500 transition-colors text-left"
                                >
                                    {item.title}
                                </button>
                                <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            ))
        )}

      </div>
    </div>
  );
};