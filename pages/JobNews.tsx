import React, { useState } from 'react';
import { Search, Briefcase, Trash2, Edit3, Plus, X, Save } from 'lucide-react';
import { JobNewsItem } from '../types';

interface JobNewsProps {
    isAdmin: boolean;
    jobNews: JobNewsItem[];
    onUpdateJobNews: (items: JobNewsItem[]) => void;
}

const JobNews: React.FC<JobNewsProps> = ({ isAdmin, jobNews, onUpdateJobNews }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobNewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<JobNewsItem>>({});

  const filteredNews = jobNews.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm("정말로 이 공고를 삭제하시겠습니까?")) {
          const updated = jobNews.filter(item => item.id !== id);
          onUpdateJobNews(updated);
          if (selectedJob?.id === id) setSelectedJob(null);
      }
  };

  const handleEditStart = (item: JobNewsItem) => {
      setFormData(item);
      setIsEditing(true);
      setIsAdding(false);
  };

  const handleAddStart = () => {
      setFormData({
          title: '',
          company: '',
          deadline: '',
          tags: [],
          content: ''
      });
      setIsAdding(true);
      setIsEditing(false);
      setSelectedJob(null);
  };

  const handleSave = () => {
      if (!formData.title || !formData.company) return;

      if (isAdding) {
          const newItem: JobNewsItem = {
              id: Date.now().toString(),
              title: formData.title!,
              company: formData.company!,
              deadline: formData.deadline || '상시채용',
              tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map((t: string) => t.trim()) : (formData.tags || []),
              content: formData.content || ''
          };
          onUpdateJobNews([newItem, ...jobNews]);
          setIsAdding(false);
      } else if (isEditing && selectedJob) {
          const updated = jobNews.map(item => item.id === selectedJob.id ? { ...item, ...formData } as JobNewsItem : item);
          onUpdateJobNews(updated);
          setSelectedJob({ ...selectedJob, ...formData } as JobNewsItem);
          setIsEditing(false);
      }
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-end mb-8">
         <div>
            <h2 className="text-3xl font-bold text-gray-900">채용 공고 {isAdmin && <span className="text-sm font-normal text-orange-600 bg-orange-100 px-2 py-1 rounded ml-2">관리자 모드</span>}</h2>
            <p className="text-gray-500 mt-1">관심 있는 직무를 찾아보세요.</p>
         </div>
         <div className="flex gap-4">
            {isAdmin && (
                <button 
                    onClick={handleAddStart}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-colors"
                >
                    <Plus size={18} /> 공고 등록
                </button>
            )}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="공고 검색..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 w-64"
                />
            </div>
         </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        {/* List */}
        <div className={`flex-1 overflow-y-auto pr-2 ${(selectedJob || isAdding) ? 'hidden md:block' : 'block'}`}>
            <div className="space-y-4">
                {filteredNews.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => {
                            setSelectedJob(item);
                            setIsAdding(false);
                            setIsEditing(false);
                        }}
                        className={`p-5 rounded-xl border transition-all cursor-pointer relative group
                            ${selectedJob?.id === item.id 
                                ? 'border-orange-500 bg-orange-50 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-lg text-gray-900">{item.company}</span>
                            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">D-{Math.floor(Math.random() * 30)}</span>
                        </div>
                        <h3 className="text-md text-gray-800 mb-3">{item.title}</h3>
                        <div className="flex gap-2">
                            {item.tags.map((tag, idx) => (
                                <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-right">마감일: {item.deadline}</p>
                        
                        {isAdmin && (
                            <button 
                                onClick={(e) => handleDelete(item.id, e)}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Detail / Edit / Add Panel */}
        {(selectedJob || isAdding) && (
            <div className="flex-[1.5] bg-white rounded-2xl border border-gray-200 p-8 overflow-y-auto shadow-lg animate-fade-in flex flex-col">
                {(isEditing || isAdding) ? (
                    // Edit/Add Mode
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold">{isAdding ? '새 공고 등록' : '공고 수정'}</h2>
                             <button onClick={() => { setIsEditing(false); setIsAdding(false); }}><X size={24} className="text-gray-400"/></button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">기업명</label>
                            <input 
                                className="w-full p-2 border rounded-lg" 
                                value={formData.company || ''} 
                                onChange={e => setFormData({...formData, company: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <input 
                                className="w-full p-2 border rounded-lg" 
                                value={formData.title || ''} 
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">마감일</label>
                            <input 
                                className="w-full p-2 border rounded-lg" 
                                value={formData.deadline || ''} 
                                placeholder="YYYY.MM.DD"
                                onChange={e => setFormData({...formData, deadline: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                            <input 
                                className="w-full p-2 border rounded-lg" 
                                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} 
                                placeholder="신입, 개발, 기획"
                                onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim())})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">상세 내용</label>
                            <textarea 
                                className="w-full p-2 border rounded-lg h-40" 
                                value={formData.content || ''} 
                                onChange={e => setFormData({...formData, content: e.target.value})}
                            />
                        </div>
                        <button 
                            onClick={handleSave}
                            className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 flex justify-center items-center gap-2"
                        >
                            <Save size={18} /> 저장하기
                        </button>
                    </div>
                ) : (
                    // View Mode
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <Briefcase size={24} className="text-gray-700"/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob!.title}</h2>
                                    <p className="text-gray-500 font-medium">{selectedJob!.company}</p>
                                </div>
                            </div>
                            {isAdmin && (
                                <button 
                                    onClick={() => handleEditStart(selectedJob!)}
                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                >
                                    <Edit3 size={20} />
                                </button>
                            )}
                        </div>
                        
                        <div className="border-t border-gray-100 py-6 space-y-4">
                            <h3 className="font-bold text-gray-900">상세 내용</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {selectedJob!.content}
                            </p>
                            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm">
                                * 본 공고는 관리자에 의해 등록되었습니다. 지원은 해당 기업 홈페이지를 이용해주세요.
                            </div>
                        </div>
                        <button onClick={() => setSelectedJob(null)} className="md:hidden mt-4 text-sm text-gray-500 underline">
                            목록으로 돌아가기
                        </button>
                    </>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default JobNews;