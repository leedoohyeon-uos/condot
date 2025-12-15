import React, { useState, useMemo } from 'react';
import { Folder, FolderOpen, ArrowLeft, Search, Hash, MoreVertical, Trash2, FolderInput, X, Bookmark } from 'lucide-react';
import { Experience, FOLDER_COLORS, FolderCategory } from '../types';
import { FOLDERS_LIST } from '../constants';

interface StorageProps {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newCategory: FolderCategory) => void;
  onToggleFavorite: (id: string) => void; // New Prop
}

const Storage: React.FC<StorageProps> = ({ experiences, onSelectExperience, onDelete, onMove, onToggleFavorite }) => {
  const [selectedFolder, setSelectedFolder] = useState<FolderCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [moveTargetId, setMoveTargetId] = useState<string | null>(null);

  // Derive all unique keywords for the hashtag cloud
  const allHashtags = useMemo(() => {
    const tags = new Set<string>();
    experiences.forEach(exp => exp.keywords.forEach(k => tags.add(k)));
    return Array.from(tags);
  }, [experiences]);

  // Filter logic
  const filteredExperiences = useMemo(() => {
    if (!searchTerm) return [];
    return experiences.filter(exp => 
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
      exp.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [experiences, searchTerm]);

  const getCount = (cat: FolderCategory) => experiences.filter(e => e.category === cat).length;

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === id ? null : id);
    setMoveTargetId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 경험 카드를 삭제하시겠습니까? 복구할 수 없습니다.")) {
      onDelete(id);
    }
    setMenuOpenId(null);
  };

  const handleMoveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMoveTargetId(id);
  };

  const handleMoveSelect = (e: React.MouseEvent, id: string, category: FolderCategory) => {
    e.stopPropagation();
    onMove(id, category);
    setMenuOpenId(null);
    setMoveTargetId(null);
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      onToggleFavorite(id);
  };

  // Render a single card (reused in folder view and search view)
  const renderCard = (exp: Experience) => (
    <div 
      key={exp.id}
      onClick={() => onSelectExperience(exp)}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 group relative"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-gray-400">{exp.dateRange}</span>
        <div className="flex items-center gap-1">
            <button 
                onClick={(e) => handleFavoriteClick(e, exp.id)}
                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${exp.isFavorite ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                <Bookmark size={16} fill={exp.isFavorite ? "currentColor" : "none"}/>
            </button>
            <button 
            onClick={(e) => handleMenuToggle(e, exp.id)}
            className="text-gray-300 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
            >
            <MoreVertical size={16} />
            </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpenId === exp.id && (
        <div className="absolute right-4 top-10 bg-white border border-gray-200 shadow-xl rounded-xl z-20 w-48 overflow-hidden animate-fade-in">
          {moveTargetId === exp.id ? (
             <div className="max-h-60 overflow-y-auto">
               <div className="px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-100">이동할 폴더 선택</div>
               {FOLDERS_LIST.map(folder => (
                 <button
                   key={folder}
                   onClick={(e) => handleMoveSelect(e, exp.id, folder as FolderCategory)}
                   className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${folder === exp.category ? 'text-orange-500 bg-orange-50' : 'text-gray-700'}`}
                 >
                   <Folder size={14} /> {folder}
                 </button>
               ))}
               <button 
                  onClick={(e) => { e.stopPropagation(); setMoveTargetId(null); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 border-t border-gray-100"
               >
                 취소
               </button>
             </div>
          ) : (
            <>
              <button 
                onClick={(e) => handleMoveClick(e, exp.id)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FolderInput size={16} /> 폴더 이동
              </button>
              <button 
                onClick={(e) => handleDeleteClick(e, exp.id)}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
              >
                <Trash2 size={16} /> 삭제하기
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Search match indicator */}
      {searchTerm && (
         <span className={`inline-block px-2 py-0.5 rounded text-[10px] mb-2 ${FOLDER_COLORS[exp.category].replace('border-', 'bg-').replace('text-', 'text-white ')}`}>
            {exp.category}
         </span>
      )}

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">{exp.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{exp.summary}</p>
      <div className="flex flex-wrap gap-1">
        {exp.keywords.slice(0, 3).map(k => (
          <span key={k} className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500">#{k}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full flex flex-col" onClick={() => setMenuOpenId(null)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
         <h2 className="text-3xl font-bold text-gray-900">내 경험함</h2>
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
               type="text" 
               placeholder="해시태그, 제목, 내용 검색..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
         </div>
      </div>

      {/* Hashtag Cloud */}
      <div className="mb-8 flex flex-wrap gap-2 max-h-24 overflow-y-auto no-scrollbar">
         {allHashtags.map(tag => (
           <button 
             key={tag}
             onClick={() => setSearchTerm(tag)}
             className={`px-3 py-1.5 rounded-full text-sm border transition-colors flex items-center gap-1
                ${searchTerm === tag 
                  ? 'bg-orange-100 border-orange-200 text-orange-700 font-bold' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'}`}
           >
             <Hash size={12} /> {tag}
           </button>
         ))}
      </div>

      {/* Content Area */}
      {searchTerm ? (
        <div className="flex-1 overflow-y-auto">
          <p className="mb-4 text-gray-500 font-medium">
             '{searchTerm}' 검색 결과: <span className="text-orange-600">{filteredExperiences.length}</span>건
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredExperiences.map(renderCard)}
             {filteredExperiences.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400">
                  검색 결과가 없습니다.
                </div>
             )}
          </div>
        </div>
      ) : selectedFolder ? (
        <div className="flex-1 animate-fade-in overflow-y-auto">
          <button 
            onClick={() => setSelectedFolder(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            폴더 목록으로
          </button>
          
          <div className="flex items-center gap-3 mb-6">
             <h2 className="text-2xl font-bold text-gray-900">{selectedFolder}</h2>
             <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-bold">
               {getCount(selectedFolder)}
             </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {experiences.filter(e => e.category === selectedFolder).map(renderCard)}
            {experiences.filter(e => e.category === selectedFolder).length === 0 && (
               <div className="col-span-full py-20 text-center text-gray-400">
                  이 폴더에 저장된 경험이 없습니다.
               </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pb-10">
          {FOLDERS_LIST.map((folderName) => {
             const category = folderName as FolderCategory;
             const count = getCount(category);
             const colorStyle = FOLDER_COLORS[category];
             const colorName = colorStyle.split(' ')[0].split('-')[1]; // e.g., 'red'
             const iconColorClass = `text-${colorName}-500`;
             
             return (
              <button
                key={folderName}
                onClick={() => setSelectedFolder(category)}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all group"
              >
                <div className={`mb-4 p-4 rounded-2xl bg-gray-50 group-hover:bg-white transition-colors`}>
                   {count > 0 ? (
                       <FolderOpen size={40} className={iconColorClass} />
                   ) : (
                       <Folder size={40} className="text-gray-300" />
                   )}
                </div>
                <span className="text-lg font-medium text-gray-900">{folderName}</span>
                <span className="text-sm text-gray-400 mt-1">{count} items</span>
              </button>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default Storage;