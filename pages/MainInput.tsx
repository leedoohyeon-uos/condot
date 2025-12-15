import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, Send, Bot, User as UserIcon, Save, Edit3, X, Check } from 'lucide-react';
import { Experience, FOLDER_COLORS, FolderCategory } from '../types';

interface MainInputProps {
  onAnalyze: (text: string) => Promise<Experience | null>;
  onModify: (currentExp: Experience, instruction: string) => Promise<Experience | null>;
  onSave: (exp: Experience) => void;
  isLoading: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  card?: Experience;
}

const MainInput: React.FC<MainInputProps> = ({ onAnalyze, onModify, onSave, isLoading }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'ai', text: '안녕하세요! 당신의 소중한 경험을 기록해드릴게요. 어떤 활동을 하셨나요? (예: "지난달에 해커톤에 참여해서 대상을 받았어")' }
  ]);
  const [inputText, setInputText] = useState("");
  const [currentCard, setCurrentCard] = useState<Experience | null>(null);
  
  // State for Manual Inline Editing
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<Experience | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentCard, isManualEditing]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // If user sends a message while editing, assume they want to cancel edit or it's a separate instruction?
    // Let's enforce finishing edit first or treat it as conversational mod on top of current state.
    if (isManualEditing) {
        alert("수정을 완료하거나 취소한 후 메시지를 보내주세요.");
        return;
    }

    const userText = inputText;
    setInputText("");

    // Add User Message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    // Logic: If we have a current card, user text is treated as modification instruction
    // If no card, user text is treated as new experience input
    if (currentCard) {
        // Modification Flow
        const aiLoadingMsg: ChatMessage = { id: 'loading', role: 'ai', text: '수정사항을 반영하고 있습니다...' };
        setMessages(prev => [...prev, aiLoadingMsg]);
        
        const updatedCard = await onModify(currentCard, userText);
        setMessages(prev => prev.filter(m => m.id !== 'loading'));
        
        if (updatedCard) {
            setCurrentCard(updatedCard);
            const aiResponse: ChatMessage = { 
                id: Date.now().toString(), 
                role: 'ai', 
                text: '카드를 수정했습니다. 더 수정하거나 저장할 수 있습니다.',
                card: updatedCard 
            };
            setMessages(prev => [...prev, aiResponse]);
        }
    } else {
        // New Creation Flow
        const aiLoadingMsg: ChatMessage = { id: 'loading', role: 'ai', text: '경험을 분석하여 카드를 생성하고 있습니다...' };
        setMessages(prev => [...prev, aiLoadingMsg]);

        const newCard = await onAnalyze(userText);
        setMessages(prev => prev.filter(m => m.id !== 'loading'));

        if (newCard) {
            setCurrentCard(newCard);
            const aiResponse: ChatMessage = { 
                id: Date.now().toString(), 
                role: 'ai', 
                text: '짜잔! 경험 카드를 만들었어요. 내용을 확인해보세요.',
                card: newCard 
            };
            setMessages(prev => [...prev, aiResponse]);
        } else {
             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: '죄송합니다. 분석에 실패했습니다. 다시 말씀해 주시겠어요?' }]);
        }
    }
  };

  const handleStartEdit = () => {
      if (currentCard) {
          setEditedCard({ ...currentCard });
          setIsManualEditing(true);
      }
  };

  const handleSaveEdit = () => {
      if (editedCard) {
          setCurrentCard(editedCard);
          // Update the specific message in history that contains the current card
          // We find the last message with a card and update it, or strictly match IDs
          setMessages(prev => prev.map(m => 
             (m.card && m.card.id === editedCard.id) ? { ...m, card: editedCard } : m
          ));
          setIsManualEditing(false);
          setEditedCard(null);
      }
  };

  const handleCancelEdit = () => {
      setIsManualEditing(false);
      setEditedCard(null);
  };

  const handleSaveCard = (exp: Experience) => {
      onSave(exp);
      setCurrentCard(null); // Reset flow
      setIsManualEditing(false);
      setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          text: '보관함에 저장했습니다! 또 다른 경험이 있으신가요?' 
      }]);
  };

  const handleCancelCard = () => {
      setCurrentCard(null);
      setIsManualEditing(false);
      setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          text: '카드 생성을 취소했습니다. 새로운 경험을 이야기해주세요.' 
      }]);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-orange-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] md:max-w-[70%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : 'items-start'}`}>
               {msg.text && (
                   <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                       msg.role === 'user' 
                       ? 'bg-gray-900 text-white rounded-tr-none' 
                       : 'bg-gray-100 text-gray-800 rounded-tl-none'
                   }`}>
                       {msg.text}
                   </div>
               )}
               
               {msg.card && (
                   <div className="mt-2 w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in transform transition-all hover:scale-[1.01]">
                       
                       {/* Color Bar */}
                       <div className={`h-2 w-full ${FOLDER_COLORS[msg.card.category].split(' ')[0].replace('bg-', 'bg-')}`}></div>
                       
                       {/* Card Content */}
                       <div className="p-6">
                           {/* Check if this is the active card being edited */}
                           {isManualEditing && currentCard && currentCard.id === msg.card.id && editedCard ? (
                               // EDIT MODE UI
                               <div className="space-y-3">
                                   <div className="flex gap-2">
                                       <select 
                                            value={editedCard.category}
                                            onChange={(e) => setEditedCard({...editedCard, category: e.target.value as FolderCategory})}
                                            className="text-xs p-1 border rounded bg-gray-50"
                                       >
                                           {Object.values(FolderCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                       </select>
                                       <input 
                                            value={editedCard.dateRange}
                                            onChange={(e) => setEditedCard({...editedCard, dateRange: e.target.value})}
                                            className="text-xs p-1 border rounded flex-1"
                                            placeholder="YYYY.MM - YYYY.MM"
                                       />
                                   </div>
                                   <input 
                                        value={editedCard.title}
                                        onChange={(e) => setEditedCard({...editedCard, title: e.target.value})}
                                        className="w-full font-bold text-gray-900 border-b border-orange-300 focus:outline-none p-1"
                                        placeholder="제목"
                                   />
                                   <textarea 
                                        value={editedCard.summary}
                                        onChange={(e) => setEditedCard({...editedCard, summary: e.target.value})}
                                        className="w-full text-sm text-gray-600 border rounded p-2 h-20 resize-none"
                                        placeholder="요약 내용"
                                   />
                                   <input 
                                        value={editedCard.keywords.join(", ")}
                                        onChange={(e) => setEditedCard({...editedCard, keywords: e.target.value.split(',').map(s=>s.trim())})}
                                        className="w-full text-xs p-1 border rounded bg-gray-50"
                                        placeholder="키워드 (쉼표로 구분)"
                                   />
                                   
                                   <div className="flex gap-2 pt-2">
                                       <button onClick={handleSaveEdit} className="flex-1 bg-gray-900 text-white py-1.5 rounded text-xs font-bold hover:bg-black">완료</button>
                                       <button onClick={handleCancelEdit} className="px-3 bg-gray-200 text-gray-600 py-1.5 rounded text-xs font-bold hover:bg-gray-300">취소</button>
                                   </div>
                               </div>
                           ) : (
                               // DISPLAY MODE UI
                               <>
                                   <div className="flex justify-between items-start mb-3">
                                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${FOLDER_COLORS[msg.card.category]}`}>
                                           {msg.card.category}
                                       </span>
                                       <span className="text-xs text-gray-400 font-mono">{msg.card.dateRange}</span>
                                   </div>
                                   <h3 className="text-lg font-bold text-gray-900 mb-2">{msg.card.title}</h3>
                                   <p className="text-sm text-gray-600 mb-4">{msg.card.summary}</p>
                                   <div className="flex flex-wrap gap-1 mb-4">
                                       {msg.card.keywords.slice(0,3).map(k => <span key={k} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded">#{k}</span>)}
                                   </div>
                                   
                                   {/* Actions only for the latest active card */}
                                   {currentCard && currentCard.id === msg.card.id && !isManualEditing && (
                                       <div className="flex gap-2 pt-4 border-t border-gray-100">
                                           <button 
                                               onClick={() => handleSaveCard(msg.card!)}
                                               className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 flex items-center justify-center gap-1"
                                           >
                                               <Save size={14}/> 저장
                                           </button>
                                           <button 
                                                onClick={handleStartEdit}
                                                className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-1"
                                                title="직접 수정"
                                           >
                                               <Edit3 size={14}/>
                                           </button>
                                           <button 
                                                onClick={handleCancelCard}
                                                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
                                           >
                                               <X size={14}/>
                                           </button>
                                       </div>
                                   )}
                               </>
                           )}
                       </div>
                   </div>
               )}
            </div>

            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <UserIcon size={20} className="text-gray-500" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4 justify-start">
                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Bot size={20} className="text-orange-600" />
                 </div>
                 <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-gray-500 flex items-center gap-2">
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
         <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
             <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                    isManualEditing 
                    ? "카드 수정 중입니다. 수정을 완료해주세요." 
                    : (currentCard ? "수정할 내용을 입력하세요 (예: 제목을 '캡스톤 프로젝트'로 변경해줘)" : "경험을 입력하세요...")
                }
                className="w-full p-4 pr-14 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm disabled:bg-gray-100 disabled:text-gray-400"
                disabled={isLoading || isManualEditing}
             />
             <button 
                type="submit"
                disabled={!inputText.trim() || isLoading || isManualEditing}
                className="absolute right-2 top-2 p-2 bg-gray-900 text-white rounded-xl hover:bg-black disabled:bg-gray-300 transition-colors"
             >
                 <Send size={20} />
             </button>
         </form>
      </div>
    </div>
  );
};

export default MainInput;