import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { HomeView } from './components/HomeView';
import { LibraryView } from './components/LibraryView';
import { TimelineView } from './components/TimelineView';
import { ResumeView } from './components/ResumeView';
import { ExperienceDetailView } from './components/ExperienceDetailView';
import { Message, Sender, Page, ExperienceCardData, FileInfo } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { ArrowUp, Mic, Plus, UserCircle } from 'lucide-react';

// Initial Mock Data with Mongolia Volunteer Card
const INITIAL_CARDS: ExperienceCardData[] = [
    {
        id: 'mock1',
        category: 'competition',
        title: 'FLOW 창업경진대회 대상',
        iconType: 'medal',
        date: '25.11.27',
        fields: [
            { label: '경험명', value: 'FLOW 창업경진대회 대상' },
            { label: '수상훈격', value: '한국연구재단 이사장상' },
            { label: '아이템', value: '커리어 아카이빙 AI' },
            { label: '역할', value: '웹 디자인 담당' },
            { label: '핵심성과', value: '대회 대상 수상 및 서비스 UI/UX 구현' }
        ]
    },
    {
        id: 'mock2',
        category: 'volunteer',
        title: '21기 몽골 글로벌봉사단',
        iconType: 'trophy',
        date: '25.07.05',
        fields: [
            { label: '경험명', value: '21기 몽골 글로벌봉사단' },
            { label: '활동내용', value: '몽골 울란바토르 해외봉사' },
            { label: '역할', value: '디자인팀장 및 태권도 교육' },
            { label: '성과', value: '우수활동상(총장상) 수상' }
        ]
    }
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Global State
  const [cards, setCards] = useState<ExperienceCardData[]>(INITIAL_CARDS);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [viewingCardId, setViewingCardId] = useState<string | null>(null);

  // Interaction State
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileInfo[]>([]);
  
  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (currentPage === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentPage, isThinking]);

  useEffect(() => {
      if (currentPage === 'chat') {
          inputRef.current?.focus();
      }
  }, [currentPage]);

  // --- Navigation Handlers ---

  const handleNavigate = (page: Page) => {
      setCurrentPage(page);
      setViewingCardId(null); // Reset detail view
      if (page !== 'library') {
          setSelectedCategoryId(null);
      }
  };

  // Requirement 3: Separated Click Handlers for Timeline
  const handleTimelineFolderClick = (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      setViewingCardId(null);
      setCurrentPage('library');
  };

  const handleTimelineTitleClick = (cardId: string) => {
      const card = cards.find(c => c.id === cardId);
      if (card) {
          setViewingCardId(cardId);
          setCurrentPage('library'); // Navigate to library but in detail view mode
      }
  };

  // New: View Card Details
  const handleViewCard = (cardId: string) => {
      setViewingCardId(cardId);
  };
  
  const handleBackFromDetail = () => {
      setViewingCardId(null);
  };

  // --- CRUD Handlers ---

  const handleUpdateCard = (id: string, updatedData: Partial<ExperienceCardData>) => {
    setCards(prev => prev.map(card => {
        if (card.id === id) {
            return { ...card, ...updatedData };
        }
        return card;
    }));
  };

  const handleDeleteCard = (id: string) => {
      setCards(prev => prev.filter(c => c.id !== id));
      if (viewingCardId === id) setViewingCardId(null);
  };

  // --- Chat Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const newFile: FileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadedAt: Date.now()
        };
        
        setPendingFiles(prev => [...prev, newFile]);

        const fileMsg: Message = {
            id: Date.now().toString(),
            sender: Sender.USER,
            text: `[파일 첨부] ${file.name}`,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, fileMsg]);
        
        // Reset input
        e.target.value = '';

        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: Sender.BOT,
                text: "파일이 첨부되었습니다. 이 내용을 작성 중인 경험에 추가할까요?",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
        }, 800);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleVoiceInput = () => {
      if (isRecording) {
          setIsRecording(false);
      } else {
          setIsRecording(true);
          setInputValue("듣고 있어요...");
          setTimeout(() => {
              setIsRecording(false);
              setInputValue("이번 여름방학 때 스타트업에서 인턴을 했어.");
              inputRef.current?.focus();
          }, 2000);
      }
  };

  const processEngineResponse = (response: import('./types').EngineResponse) => {
      const { action, message, data, targetId } = response;

      let finalBotMessage = message;
      let displayCard: ExperienceCardData | undefined = undefined;

      if (action === 'create' && data) {
          const newId = Date.now().toString();
          const newCard: ExperienceCardData = { 
              ...data, 
              id: newId,
              files: pendingFiles.length > 0 ? [...pendingFiles] : undefined
          };
          
          setCards(prev => [...prev, newCard]);
          setPendingFiles([]); 
          
          displayCard = newCard;
      } 
      else if (action === 'update' && data) {
          setCards(prev => {
              const updatedList = [...prev];
              const index = targetId 
                  ? updatedList.findIndex(c => c.id === targetId) 
                  : updatedList.length - 1; 
              
              if (index !== -1) {
                  const existingFiles = updatedList[index].files || [];
                  const updatedFiles = pendingFiles.length > 0 ? [...existingFiles, ...pendingFiles] : existingFiles;

                  updatedList[index] = { 
                      ...updatedList[index], 
                      ...data, 
                      id: updatedList[index].id,
                      files: updatedFiles
                  }; 
                  displayCard = updatedList[index];
                  
                  if (pendingFiles.length > 0) setPendingFiles([]);

                  return updatedList;
              }
              return prev;
          });
      }
      else if (action === 'delete') {
           setCards(prev => {
               if (targetId) return prev.filter(c => c.id !== targetId);
               return prev.slice(0, -1); 
           });
      }

      return {
          id: Date.now().toString(),
          sender: Sender.BOT,
          text: finalBotMessage,
          cardData: displayCard,
          timestamp: Date.now()
      };
  };

  const handleStartChat = async (initialMessage: string, file?: File) => {
    setCurrentPage('chat');
    setViewingCardId(null);
    
    const newUserMsg: Message = {
        id: Date.now().toString(),
        sender: Sender.USER,
        text: initialMessage,
        timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMsg]);
    
    setIsThinking(true);

    let fileData = undefined;
    let finalMessage = initialMessage;

    if (file) {
      try {
        const base64 = await readFileAsBase64(file);
        fileData = { mimeType: file.type, base64 };
        finalMessage = `${initialMessage}\n\n[System Note: The user has uploaded a file named '${file.name}'. Please analyze this file content to extract experience details and create a card.]`;
        
        const newFileInfo: FileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadedAt: Date.now()
        };
        setPendingFiles([newFileInfo]);

      } catch (e) {
        console.error("File read error", e);
      }
    }

    const response = await sendMessageToGemini(finalMessage, fileData);
    const newBotMsg = processEngineResponse(response);
    
    setMessages(prev => [...prev, newBotMsg]);
    setIsThinking(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && pendingFiles.length === 0) return;

    const userText = inputValue;
    setInputValue('');

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: userText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsThinking(true);

    const response = await sendMessageToGemini(userText);
    const newBotMsg = processEngineResponse(response);

    setMessages(prev => [...prev, newBotMsg]);
    setIsThinking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
  };

  // --- Render ---

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView onStartChat={handleStartChat} />;
      
      case 'library':
        if (viewingCardId) {
            const cardToView = cards.find(c => c.id === viewingCardId);
            if (cardToView) {
                return <ExperienceDetailView card={cardToView} onBack={handleBackFromDetail} />;
            }
        }
        return (
            <LibraryView 
                cards={cards} 
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onUpdateCard={handleUpdateCard} 
                onDeleteCard={handleDeleteCard} 
                onViewCard={handleViewCard}
            />
        );

      case 'timeline':
        return (
            <TimelineView 
                cards={cards} 
                onFolderClick={handleTimelineFolderClick}
                onTitleClick={handleTimelineTitleClick}
            />
        );

      case 'resume':
        return <ResumeView />;

      case 'chat':
      default:
        return (
          <div className="flex-1 flex flex-col relative h-full">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 pt-20 pb-32 no-scrollbar bg-[#F5F5F5]">
              <div className="max-w-3xl mx-auto">
                {messages.map(msg => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isThinking && (
                   <div className="flex justify-start mb-6">
                       <div className="flex flex-row gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border-2 border-[#FF8A00]">
                              <div className="text-white text-[10px]">C</div>
                           </div>
                           <div className="px-5 py-3 bg-white rounded-[20px] rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                           </div>
                       </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:pb-8 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5] to-transparent">
              <div className="max-w-3xl mx-auto relative">
                <div className={`bg-white rounded-full border shadow-lg flex items-center px-2 py-2 md:py-3 transition-all ${isRecording ? 'border-[#FF8A00] ring-1 ring-[#FF8A00]' : 'border-gray-300 focus-within:border-black'}`}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-gray-800 transition-colors"
                        title="파일 첨부"
                    >
                        <Plus size={24} />
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent outline-none px-2 text-base placeholder:text-gray-400"
                        placeholder={pendingFiles.length > 0 ? `${pendingFiles.length}개 파일 첨부됨. 내용을 입력하세요.` : "내가 사용한 툴이 Figma였다는 것도 추가해줘."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isThinking || isRecording}
                        style={{ color: isRecording ? '#FF8A00' : 'inherit' }}
                    />
                    
                    <div className="flex items-center gap-2 mr-1">
                        <button 
                            onClick={handleVoiceInput}
                            className={`p-2 transition-colors rounded-full ${isRecording ? 'text-[#FF8A00] bg-orange-50 animate-pulse' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'}`}
                        >
                            <Mic size={20} />
                        </button>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isThinking || isRecording}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                inputValue.trim() && !isRecording
                                ? 'bg-black text-white hover:scale-105' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <ArrowUp size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-[#333333]">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-transparent absolute top-0 left-0 right-0 z-20 pointer-events-none">
           <div className="md:hidden font-black text-xl pointer-events-auto flex items-baseline">
             CONDOT<span className="text-[#FF8A00]">.</span>
           </div>
           <div className="ml-auto pointer-events-auto">
             <button className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
                <UserCircle className="w-12 h-12 text-gray-400 mt-2" />
             </button>
           </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
