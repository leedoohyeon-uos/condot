import React, { useState, useRef } from 'react';
import { ArrowLeft, Bookmark, CheckCircle2, Lightbulb, Edit3, Save, X, Paperclip, FileText, File as FileIcon } from 'lucide-react';
import { Experience, FOLDER_COLORS, PortfolioContent, Attachment } from '../types';

interface DetailViewProps {
  experience: Experience;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdate: (updatedExp: Experience) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ experience, onBack, onToggleFavorite, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExp, setEditedExp] = useState<Experience>(experience);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorClass = FOLDER_COLORS[experience.category];

  const handleSave = () => {
      onUpdate(editedExp);
      setIsEditing(false);
  };

  const handleCancel = () => {
      setEditedExp(experience);
      setIsEditing(false);
  };

  const updateContent = (field: keyof PortfolioContent, value: any) => {
      setEditedExp(prev => ({
          ...prev,
          content: {
              ...prev.content,
              [field]: value
          }
      }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newAttachment: Attachment = {
              id: Date.now().toString(),
              name: file.name,
              url: '#', // Mock URL
              type: file.name.endsWith('ppt') || file.name.endsWith('pptx') ? 'ppt' : 'report',
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
          };
          
          setEditedExp(prev => ({
              ...prev,
              attachments: [...(prev.attachments || []), newAttachment]
          }));
      }
  };

  const removeAttachment = (id: string) => {
      setEditedExp(prev => ({
          ...prev,
          attachments: prev.attachments?.filter(a => a.id !== id) || []
      }));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white min-h-full shadow-xl border-x border-gray-100">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
            </div>
            
            <div className="flex gap-2">
                {isEditing ? (
                     <>
                        <button onClick={handleCancel} className="flex items-center gap-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <X size={18} /> 취소
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black">
                            <Save size={18} /> 저장
                        </button>
                     </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit3 size={18} /> 수정
                        </button>
                        <button 
                            onClick={() => onToggleFavorite(experience.id)}
                            className={`p-2 rounded-full transition-colors ${experience.isFavorite ? 'text-yellow-400 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <Bookmark size={24} fill={experience.isFavorite ? "currentColor" : "none"} />
                        </button>
                    </>
                )}
            </div>
        </div>

        <div className="p-10 space-y-10">
            {/* Title Section */}
            <section>
                <div className={`inline-block px-3 py-1 rounded-md text-sm font-bold mb-4 ${colorClass}`}>
                    {experience.category}
                </div>
                {isEditing ? (
                    <div className="space-y-4">
                        <input 
                            className="w-full text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-orange-500 outline-none pb-2"
                            value={editedExp.title}
                            onChange={(e) => setEditedExp({...editedExp, title: e.target.value})}
                        />
                        <div className="flex items-center gap-2">
                             <input 
                                className="text-lg text-gray-500 font-medium border-b border-gray-200 focus:border-orange-500 outline-none"
                                value={editedExp.dateRange}
                                onChange={(e) => setEditedExp({...editedExp, dateRange: e.target.value})}
                                placeholder="YYYY.MM - YYYY.MM"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{experience.title}</h1>
                        <p className="text-lg text-gray-500 font-medium">{experience.dateRange}</p>
                    </>
                )}
            </section>

            {/* Attachments Section */}
            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Paperclip size={18}/> 첨부 파일 (PPT/보고서)
                    </h3>
                    {isEditing && (
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileUpload}
                                accept=".ppt,.pptx,.pdf,.doc,.docx"
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-orange-600 font-bold hover:underline"
                            >
                                + 파일 추가
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="space-y-2">
                    {editedExp.attachments?.length === 0 && (
                        <p className="text-sm text-gray-400">첨부된 파일이 없습니다.</p>
                    )}
                    {editedExp.attachments?.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${file.type === 'ppt' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <FileText size={20}/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{file.name}</p>
                                    <p className="text-xs text-gray-400">{file.size || 'Unknown size'}</p>
                                </div>
                            </div>
                            {isEditing && (
                                <button onClick={() => removeAttachment(file.id)} className="text-gray-400 hover:text-red-500 p-2">
                                    <X size={16}/>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Keywords */}
            <section className="flex flex-wrap gap-2">
                {isEditing ? (
                    <input 
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                        value={editedExp.keywords.join(", ")}
                        onChange={(e) => setEditedExp({...editedExp, keywords: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="키워드 (쉼표로 구분)"
                    />
                ) : (
                    experience.keywords.map(k => (
                        <span key={k} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                            #{k}
                        </span>
                    ))
                )}
            </section>

            {/* Portfolio Content */}
            <div className="space-y-8">
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                    <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-2">Overview</h3>
                    {isEditing ? (
                        <textarea 
                            className="w-full bg-white border border-orange-200 rounded-lg p-3 text-gray-800 text-lg font-medium leading-relaxed"
                            rows={3}
                            value={editedExp.content.overview}
                            onChange={(e) => updateContent('overview', e.target.value)}
                        />
                    ) : (
                        <p className="text-gray-800 text-lg font-medium leading-relaxed">"{experience.content.overview}"</p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                            <CheckCircle2 size={20} className="text-blue-500"/> 
                            역할 (Role)
                        </h3>
                        {isEditing ? (
                            <textarea 
                                className="w-full border border-gray-200 rounded-lg p-3 text-gray-600"
                                rows={4}
                                value={editedExp.content.role}
                                onChange={(e) => updateContent('role', e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-600 leading-relaxed">{experience.content.role}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                             <Lightbulb size={20} className="text-yellow-500"/> 
                             배운 점 (Learned)
                        </h3>
                         {isEditing ? (
                            <textarea 
                                className="w-full border border-gray-200 rounded-lg p-3 text-gray-600"
                                rows={4}
                                value={editedExp.content.learned}
                                onChange={(e) => updateContent('learned', e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-600 leading-relaxed">{experience.content.learned}</p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">주요 성과 (Outcomes)</h3>
                    {isEditing ? (
                        <textarea 
                             className="w-full border border-gray-200 rounded-lg p-3 text-gray-600"
                             rows={4}
                             value={editedExp.content.outcomes.join('\n')}
                             onChange={(e) => updateContent('outcomes', e.target.value.split('\n'))}
                             placeholder="성과를 줄바꿈으로 구분하세요"
                        />
                    ) : (
                        <ul className="space-y-3">
                            {experience.content.outcomes.map((outcome, idx) => (
                                <li key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                                    <div className="min-w-[6px] h-[6px] rounded-full bg-green-500 mt-2.5" />
                                    <span className="text-gray-700">{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">사용 기술 (Skills)</h3>
                    {isEditing ? (
                         <input 
                             className="w-full border border-gray-200 rounded-lg p-3 text-gray-600"
                             value={editedExp.content.skills_used.join(', ')}
                             onChange={(e) => updateContent('skills_used', e.target.value.split(',').map(s => s.trim()))}
                        />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {experience.content.skills_used.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 border border-gray-200 rounded-full text-sm text-gray-600">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;