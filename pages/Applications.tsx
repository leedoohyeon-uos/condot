
import React, { useState } from 'react';
import { Plus, Link as LinkIcon, FileText, ChevronRight, X, Save, Trash2, Building2 } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types';

interface ApplicationsProps {
  applications: JobApplication[];
  onAdd: (app: JobApplication) => void;
  onUpdate: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onNavigate: (pageId: string) => void;
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PREPARING]: "bg-gray-100 text-gray-600",
  [ApplicationStatus.APPLIED]: "bg-blue-50 text-blue-600",
  [ApplicationStatus.DOC_PASS]: "bg-green-50 text-green-600",
  [ApplicationStatus.INTERVIEW_1]: "bg-purple-50 text-purple-600",
  [ApplicationStatus.INTERVIEW_2]: "bg-purple-100 text-purple-700",
  [ApplicationStatus.FINAL_PASS]: "bg-orange-50 text-orange-600 border border-orange-200",
  [ApplicationStatus.REJECTED]: "bg-red-50 text-red-600",
};

const Applications: React.FC<ApplicationsProps> = ({ applications, onAdd, onUpdate, onDelete, onNavigate }) => {
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  
  // Minimal editing state (full creation is now in CoverLetter Assistant)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});

  const handleEdit = (app: JobApplication) => {
      setSelectedApp(app);
      setFormData(app);
      setIsEditing(false); // View mode first
  };

  const handleSave = () => {
      if (selectedApp) {
          onUpdate({ ...selectedApp, ...formData } as JobApplication);
          setIsEditing(false);
          setSelectedApp(null);
      }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-gray-50">
      <div className={`flex-1 flex flex-col p-6 overflow-hidden ${selectedApp ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">나의 자소서 (My Personal Statements)</h2>
                <p className="text-gray-500 text-sm">생성된 자기소개서와 지원 내역을 관리하세요.</p>
            </div>
            <button 
                onClick={() => onNavigate('cover_letter')}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black shadow-lg transition-all"
            >
                <Plus size={18} /> 새 자소서 생성
            </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {applications.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    생성된 자소서가 없습니다.
                </div>
            )}
            {applications.map(app => (
                <div 
                    key={app.id}
                    onClick={() => handleEdit(app)}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md
                        ${selectedApp?.id === app.id ? 'border-orange-500 shadow-md ring-1 ring-orange-100' : 'border-gray-200 hover:border-gray-300'}
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${statusColors[app.status]}`}>
                            {app.status}
                        </span>
                        <span className="text-xs text-gray-400">{app.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {app.company}
                    </h3>
                    <p className="text-sm text-gray-500">{app.position} {app.experienceLevel && `(${app.experienceLevel})`}</p>
                </div>
            ))}
        </div>
      </div>

      {selectedApp && (
        <div className="flex-[1.5] bg-white border-l border-gray-200 p-8 overflow-y-auto animate-fade-in flex flex-col h-full shadow-2xl z-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedApp.company}</h2>
                <div className="flex gap-2">
                    {isEditing ? (
                        <button onClick={handleSave} className="p-2 bg-orange-600 text-white rounded-lg"><Save size={18}/></button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><FileText size={18}/></button>
                    )}
                    <button onClick={() => setSelectedApp(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={24}/></button>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                {isEditing ? (
                    <div className="space-y-4">
                        <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-2 border rounded"/>
                        <textarea value={formData.coverLetter} onChange={e => setFormData({...formData, coverLetter: e.target.value})} className="w-full h-96 p-2 border rounded"/>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {selectedApp.coverLetter}
                    </div>
                )}
            </div>
            
             <div className="mt-4 pt-4 border-t flex justify-end">
                <button onClick={(e) => { onDelete(selectedApp.id); setSelectedApp(null); }} className="text-red-500 hover:underline flex items-center gap-1">
                    <Trash2 size={16}/> 삭제하기
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
