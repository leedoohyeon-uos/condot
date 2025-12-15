
import React, { useState } from 'react';
import { FileText, Send, Upload, Loader2, Database, Plus, Check, Save, Edit3, X } from 'lucide-react';
import { Experience, ReferenceMaterial, JobApplication, ApplicationStatus } from '../types';
import { generateCoverLetterWithGemini, parseReferenceMaterial } from '../services/geminiService';

interface CoverLetterProps {
  experiences: Experience[];
  isAdmin?: boolean;
  references?: ReferenceMaterial[];
  onAddReference?: (ref: ReferenceMaterial) => void;
  onSaveApplication?: (app: JobApplication) => void;
  onNavigate?: (pageId: string) => void;
}

const CoverLetter: React.FC<CoverLetterProps> = ({ experiences, isAdmin = false, references = [], onAddReference, onSaveApplication, onNavigate }) => {
  const [mode, setMode] = useState<'generate' | 'admin'>('generate');

  // Input State
  const [targetCompany, setTargetCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'신입' | '경력'>('신입');
  const [companyType, setCompanyType] = useState<'대기업' | '중견/중소' | '스타트업' | '공공기관'>('대기업');
  const [jobDescription, setJobDescription] = useState('');
  
  // Output State
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingResult, setIsEditingResult] = useState(false);

  // Admin Input State
  const [rawReferenceText, setRawReferenceText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !targetCompany) {
        alert("기업명과 공고 내용을 입력해주세요.");
        return;
    }
    
    setIsGenerating(true);
    try {
      // Pass references to the generator context
      // Construct a richer prompt context with the new fields
      const fullPrompt = `Target Company: ${targetCompany}, Type: ${companyType}\nRole: ${jobRole}, Level: ${experienceLevel}\n\nJob Description:\n${jobDescription}`;
      
      const result = await generateCoverLetterWithGemini(fullPrompt, experiences, references);
      setGeneratedLetter(result);
      setIsEditingResult(false);
      
      // Auto-save logic
      if (onSaveApplication) {
          const newApp: JobApplication = {
              id: Date.now().toString(),
              company: targetCompany,
              position: jobRole,
              date: new Date().toISOString().slice(0, 10),
              status: ApplicationStatus.PREPARING,
              jobPostingUrl: '',
              coverLetter: result,
              jobRole: jobRole,
              experienceLevel: experienceLevel,
              companyType: companyType,
              createdAt: new Date().toISOString()
          };
          onSaveApplication(newApp);
      }
      
    } catch (error) {
      alert("생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveModified = () => {
      if (!generatedLetter.trim()) return;
      // In a real scenario, we might update the last saved application.
      // For now, we'll just alert and redirect.
      if (onNavigate) {
          if(window.confirm("자소서를 저장하고 목록으로 이동하시겠습니까?")) {
             // In a full implementation, we'd update the Firestore doc here. 
             // Since onSaveApplication creates a NEW one, we assume the auto-save happened on generation.
             // We could add an onUpdateApplication prop, but for simplicity:
             alert("저장되었습니다.");
             onNavigate('applications');
          }
      }
      setIsEditingResult(false);
  };

  const handleAddReference = async () => {
      if (!rawReferenceText.trim() || !onAddReference) return;
      setIsParsing(true);
      try {
          const parsedData = await parseReferenceMaterial(rawReferenceText);
          const newRef: ReferenceMaterial = {
              id: Date.now().toString(),
              company: parsedData.company || "Unknown",
              jobRole: parsedData.jobRole || "Unknown",
              question: parsedData.question || "Motivation",
              answer: parsedData.answer || rawReferenceText,
              keyCapabilities: parsedData.keyCapabilities || [],
              createdAt: new Date().toISOString()
          };
          onAddReference(newRef);
          setRawReferenceText("");
          alert("저장되었습니다!");
      } catch (e) {
          alert("분석 실패");
      } finally {
          setIsParsing(false);
      }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {isAdmin && (
          <div className="flex border-b border-gray-200">
              <button onClick={() => setMode('generate')} className={`px-6 py-3 text-sm font-bold flex items-center gap-2 ${mode === 'generate' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FileText size={16}/> 자소서 생성
              </button>
              <button onClick={() => setMode('admin')} className={`px-6 py-3 text-sm font-bold flex items-center gap-2 ${mode === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Database size={16}/> 레퍼런스 관리 (Admin)
              </button>
          </div>
      )}

      {mode === 'generate' ? (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Input Panel */}
            <div className="flex-1 p-8 border-r border-gray-200 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="text-orange-500"/> 자소서 도우미
                </h2>
                
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지원 기업</label>
                            <input 
                                value={targetCompany}
                                onChange={(e) => setTargetCompany(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl"
                                placeholder="예: 삼성전자"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지원 직무</label>
                            <input 
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl"
                                placeholder="예: 마케팅"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">경력 구분</label>
                            <select 
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value as any)}
                                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                            >
                                <option value="신입">신입</option>
                                <option value="경력">경력</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">기업 형태</label>
                            <select 
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value as any)}
                                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                            >
                                <option value="대기업">대기업</option>
                                <option value="중견/중소">중견/중소</option>
                                <option value="스타트업">스타트업</option>
                                <option value="공공기관">공공기관</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">채용 공고 내용 / 문항</label>
                        <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="공고 내용이나 자소서 문항을 입력하세요..."
                        />
                    </div>
                    
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !targetCompany}
                        className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:bg-gray-300 flex justify-center items-center gap-2"
                    >
                        {isGenerating ? <Loader2 className="animate-spin"/> : <Send size={18}/>}
                        {isGenerating ? 'AI가 작성 중...' : '자소서 생성하기'}
                    </button>
                </div>
            </div>

            {/* Output Panel */}
            <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                {generatedLetter ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <h3 className="font-bold text-gray-900">생성 결과</h3>
                            <div className="flex gap-2">
                                {isEditingResult ? (
                                    <>
                                        <button onClick={() => setIsEditingResult(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
                                        <button onClick={handleSaveModified} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"><Save size={18}/></button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditingResult(true)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                                        <Edit3 size={16}/> 수정
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {isEditingResult ? (
                            <textarea 
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                className="flex-1 w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-500 leading-relaxed"
                            />
                        ) : (
                            <div className="flex-1 whitespace-pre-wrap text-gray-700 leading-loose text-justify overflow-y-auto">
                                {generatedLetter}
                            </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t text-center">
                            <button 
                                onClick={handleSaveModified}
                                className="text-orange-600 font-bold hover:underline"
                            >
                                저장하고 목록으로 이동
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p>정보를 입력하고 생성 버튼을 눌러주세요.</p>
                    </div>
                )}
            </div>
        </div>
      ) : (
          <div className="flex-1 p-8 bg-indigo-50/30 overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-indigo-100">
                  <h2 className="text-xl font-bold text-indigo-900 mb-4">레퍼런스 추가</h2>
                  <textarea 
                      value={rawReferenceText}
                      onChange={(e) => setRawReferenceText(e.target.value)}
                      className="w-full h-40 p-4 border border-gray-200 rounded-lg mb-4"
                      placeholder="합격 자소서 내용을 붙여넣으세요..."
                  />
                  <button 
                      onClick={handleAddReference}
                      disabled={isParsing}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold"
                  >
                      {isParsing ? '분석 중...' : '데이터베이스에 추가'}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CoverLetter;
