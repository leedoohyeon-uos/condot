import React from 'react';
import { ExperienceCardData, CATEGORIES } from '../types';
import { ExperienceCard } from './ExperienceCard';
import { ArrowLeft } from 'lucide-react';

interface LibraryViewProps {
  cards: ExperienceCardData[];
  selectedCategoryId: string | null; // Controlled state
  onSelectCategory: (categoryId: string | null) => void;
  onUpdateCard?: (id: string, updatedData: Partial<ExperienceCardData>) => void;
  onDeleteCard?: (id: string) => void;
  onViewCard?: (id: string) => void; // New prop for navigating to detail view
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
    cards, 
    selectedCategoryId, 
    onSelectCategory, 
    onUpdateCard, 
    onDeleteCard,
    onViewCard
}) => {
  
  const selectedCategory = selectedCategoryId 
    ? CATEGORIES.find(c => c.id === selectedCategoryId) 
    : null;

  // Filter cards by selected category
  const filteredCards = selectedCategory 
    ? cards.filter(c => c.category === selectedCategory.id)
    : [];

  // Folder Grid View
  if (!selectedCategory) {
    return (
        <div className="flex-1 h-full bg-[#F5F5F5] p-8 overflow-y-auto">
            
            <div className="flex h-full gap-8">
                {/* Inner Sidebar Filters */}
                <div className="w-48 shrink-0 hidden lg:block">
                    <div className="bg-white/50 rounded-xl p-4 space-y-1">
                        <div className="px-3 py-2 font-bold text-gray-800">내 경험함</div>
                        <div className="h-[1px] bg-gray-200 my-2"></div>
                        {CATEGORIES.map(cat => {
                            const count = cards.filter(c => c.category === cat.id).length;
                            return (
                                <div key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/60 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: cat.hex }}></div>
                                        <span className="text-sm font-medium text-gray-600">{cat.name}</span>
                                    </div>
                                    {count > 0 && <span className="text-xs text-gray-400 font-mono">{count}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 content-start">
                    {CATEGORIES.map(cat => {
                        const hasItems = cards.some(c => c.category === cat.id);
                        return (
                            <button 
                                key={cat.id} 
                                onClick={() => onSelectCategory(cat.id)}
                                className="flex flex-col items-center gap-4 group"
                            >
                                {/* Folder Icon */}
                                <div className="relative w-32 h-24 transition-transform group-hover:-translate-y-2 duration-300">
                                    {/* Back part */}
                                    <div 
                                        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-sm transition-all"
                                        style={{ backgroundColor: cat.hex, filter: hasItems ? 'brightness(0.9)' : 'grayscale(1) opacity(0.5)' }}
                                    ></div>
                                    {/* Tab */}
                                    <div 
                                        className="absolute -top-3 left-0 w-1/3 h-4 rounded-t-lg transition-all"
                                        style={{ backgroundColor: cat.hex, filter: hasItems ? 'brightness(0.9)' : 'grayscale(1) opacity(0.5)' }}
                                    ></div>
                                    {/* Front part */}
                                    <div 
                                        className="absolute top-1 left-0 w-full h-full rounded-lg shadow-md flex items-center justify-center transition-all"
                                        style={{ backgroundColor: cat.hex, filter: hasItems ? 'none' : 'grayscale(1) opacity(0.5)' }}
                                    >
                                        {hasItems && (
                                            <div className="w-[90%] h-[80%] bg-white/10 rounded-md border border-white/20"></div>
                                        )}
                                    </div>
                                </div>
                                
                                <span className={`font-bold text-lg ${hasItems ? 'text-gray-700' : 'text-gray-400'}`}>{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
  }

  // Folder Detail View (Grid of Cards)
  return (
    <div className="flex-1 h-full bg-[#F5F5F5] p-8 overflow-y-auto flex flex-col">
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
            onClick={() => onSelectCategory(null)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
            <div className="w-8 h-6 rounded relative" style={{ backgroundColor: selectedCategory.hex }}>
                 <div className="absolute -top-1 left-0 w-3 h-2 rounded-t bg-inherit opacity-80"></div>
            </div>
            <h2 className="text-2xl font-black">{selectedCategory.name}</h2>
            <span className="text-gray-400 font-medium ml-2">{filteredCards.length} items</span>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-10">
            {filteredCards.map((card) => (
                <div key={card.id} className="transform transition-transform duration-300">
                    <ExperienceCard 
                      data={card} 
                      onUpdate={onUpdateCard}
                      onDelete={onDeleteCard}
                      onClick={() => onViewCard && onViewCard(card.id)} // Pass click handler
                    />
                </div>
            ))}
          </div>
      ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">?</div>
              <p>아직 생성된 경험 카드가 없습니다.</p>
          </div>
      )}
    </div>
  );
};
