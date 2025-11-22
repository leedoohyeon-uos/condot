import React, { useState, useEffect } from 'react';
import { ExperienceCardData, CATEGORIES } from '../types';
import { Award, Star, Trophy, Briefcase, Book, Heart, Users, Globe, FileText, Paperclip, Edit2, Trash2, Check, X, Calendar, Tag } from 'lucide-react';

interface ExperienceCardProps {
  data: ExperienceCardData;
  onUpdate?: (id: string, updatedData: Partial<ExperienceCardData>) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void; // New prop
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ data, onUpdate, onDelete, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ExperienceCardData>(data);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setEditForm(data);
  }, [data]);

  const categoryDef = CATEGORIES.find(c => c.id === data.category) || CATEGORIES[CATEGORIES.length - 1]; 
  const baseColor = categoryDef.hex;
  
  // --- Icon Helper ---
  const getIcon = () => {
    const props = { className: `w-16 h-16 text-gray-700/20`, fill: "currentColor" };
    switch (data.category) {
      case 'intern': return <Briefcase {...props} />;
      case 'education': return <Book {...props} />;
      case 'volunteer': return <Heart {...props} />;
      case 'activity': return <Users {...props} />;
      case 'language': return <Globe {...props} />;
      case 'cert': return <FileText {...props} />;
      default:
        switch (data.iconType) {
          case 'trophy': return <Trophy {...props} />;
          case 'star': return <Star {...props} />;
          default: return <Award {...props} />;
        }
    }
  };

  const findField = (keywords: string[]) => {
    return editForm.fields.find(f => keywords.some(k => f.label.includes(k)));
  };

  const typeField = findField(['역량', '유형', '태그']) || { label: '경험 유형', value: categoryDef.name };
  const summaryField = findField(['내용', '요약', '아이템', '설명']) || editForm.fields[0] || { label: '활동 내용 요약', value: '내용이 없습니다.' };
  const achievementField = findField(['성과', '결과', '배운점']) || editForm.fields[editForm.fields.length - 1] || { label: '획득 성과', value: '성과가 없습니다.' };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) onUpdate(data.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditForm(data);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm("정말 이 경험 카드를 삭제하시겠습니까?")) {
          if (onDelete) onDelete(data.id);
      }
  };

  return (
    <div className="relative group mx-auto">
      {/* 1. Consistent Size: Fixed width and height */}
      <div 
        onClick={!isEditing && onClick ? onClick : undefined}
        className={`w-[340px] h-[520px] rounded-[32px] bg-white shadow-xl border border-gray-100 overflow-hidden flex flex-col relative transition-all hover:shadow-2xl hover:-translate-y-1 ${onClick && !isEditing ? 'cursor-pointer' : ''}`}
        style={{ 
            background: `linear-gradient(180deg, #FFFFFF 40%, ${baseColor}15 100%)`
        }}
      >
        
        {/* --- Header Section --- */}
        <div className="pt-8 px-6 pb-4 flex flex-col items-center text-center relative z-10">
            
            {/* Edit/Delete Controls (Always Visible or Prominent) */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
                 {isEditing ? (
                    <>
                        <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition-colors" title="저장">
                            <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-2 bg-gray-400 text-white rounded-full shadow hover:bg-gray-500 transition-colors" title="취소">
                            <X size={16} />
                        </button>
                    </>
                 ) : (
                    <>
                        {onUpdate && (
                            <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-gray-800 transition-colors" title="수정">
                                <Edit2 size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="삭제">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </>
                 )}
            </div>

            {/* 1. Activity Name (Title) */}
            {isEditing ? (
                <input 
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xl font-black text-gray-800 text-center bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full mb-2"
                />
            ) : (
                <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2 line-clamp-2 leading-tight min-h-[3.5rem] flex items-center justify-center">
                    {data.title}
                </h3>
            )}

            {/* Heart Icon */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                className={`mb-4 transition-transform active:scale-90 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
            >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            {/* Background Icon Decoration */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none scale-150">
                {getIcon()}
            </div>
        </div>

        {/* --- Body Section (5 Mandatory Fields) --- */}
        <div className="flex-1 px-6 pb-6 flex flex-col gap-5 overflow-y-auto no-scrollbar relative z-10">
            
            {/* 2. Experience Type (Competency Tag) */}
            <div className="flex flex-col items-start gap-1">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <Tag size={12} />
                    경험 유형
                </label>
                <span 
                    className="px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm"
                    style={{ backgroundColor: `${baseColor}40`, color: '#333' }}
                >
                    #{typeField.value}
                </span>
            </div>

            {/* 3. Duration (Date) */}
            <div className="flex flex-col items-start gap-1">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    경험 기간
                </label>
                {isEditing ? (
                     <input 
                        value={editForm.date}
                        onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full"
                        placeholder="YY.MM.DD"
                    />
                ) : (
                    <span className="text-sm font-medium text-gray-700 tracking-wide font-mono">
                        20{data.date} ~ 20{data.date} (종료)
                    </span>
                )}
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-gray-100"></div>

            {/* 4. Activity Summary */}
            <div className="flex flex-col gap-1 flex-1">
                 <label className="text-xs font-bold text-gray-400">
                    활동 내용 요약
                 </label>
                 <div className="bg-white/60 rounded-xl p-3 border border-gray-100 h-full shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed break-keep">
                        {summaryField.value}
                    </p>
                 </div>
            </div>

            {/* 5. Key Achievement */}
            <div className="flex flex-col gap-1">
                 <label className="text-xs font-bold text-brand-orange">
                    획득 성과
                 </label>
                 <div className="bg-brand-orange/10 rounded-xl p-3 border border-brand-orange/20 shadow-sm">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed break-keep">
                        {achievementField.value}
                    </p>
                 </div>
            </div>

            {/* Files (Optional but maintained) */}
            {data.files && data.files.length > 0 && (
                <div className="mt-2">
                     {data.files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-1.5 rounded mb-1">
                            <Paperclip size={10} />
                            <span className="truncate">{file.name}</span>
                        </div>
                     ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
