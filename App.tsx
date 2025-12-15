import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  Timestamp 
} from "firebase/firestore";

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import MainInput from './pages/MainInput';
import Storage from './pages/Storage';
import Timeline from './pages/Timeline';
import DetailView from './pages/DetailView';
import JobNews from './pages/JobNews';
import CoverLetter from './pages/CoverLetter';
import Applications from './pages/Applications';
import Recommendations from './pages/Recommendations';

import { User, Experience, JobNewsItem, FolderCategory, JobApplication, ReferenceMaterial, GlobalConfig } from './types';
import { analyzeExperienceWithGemini, modifyExperienceWithGemini } from './services/geminiService';
import { MOCK_JOB_NEWS } from './constants';
import { CONFIG } from './config'; // Import Config

// Use Config for initialization
const app = initializeApp(CONFIG.FIREBASE);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = CONFIG.FIRESTORE.APP_ID;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const [currentPage, setCurrentPage] = useState<string>('main_input');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [jobNewsList, setJobNewsList] = useState<JobNewsItem[]>(MOCK_JOB_NEWS);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({ isTestMode: true });
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const newUser: User = {
          name: fbUser.displayName || "User",
          email: fbUser.email || "",
          avatarUrl: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.displayName || 'User'}&background=random`,
          isAdmin: fbUser.email === "admin@uos.ac.kr"
        };
        setUser(newUser);
        setUserId(fbUser.uid);
      } else {
        if (!userId?.startsWith('demo-')) {
            setUser(null);
            setUserId(null);
        }
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
      const configRef = doc(db, `artifacts/${APP_ID}/config`, 'global');
      const unsubscribe = onSnapshot(configRef, (doc) => {
          if (doc.exists()) {
              setGlobalConfig(doc.data() as GlobalConfig);
          }
      }, (error) => {
          console.warn("Config sync failed. Defaulting to local config.");
      });
      return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setExperiences([]);
      setApplications([]);
      return;
    }

    const expCollectionPath = `artifacts/${APP_ID}/users/${userId}/experiences`;
    const appCollectionPath = `artifacts/${APP_ID}/users/${userId}/applications`;
    
    const unsubscribeExp = onSnapshot(collection(db, expCollectionPath), (snapshot) => {
      const fetchedExperiences: Experience[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedExperiences.push({
          id: doc.id,
          title: data.title,
          dateRange: data.dateRange,
          year: data.year,
          summary: data.summary,
          category: data.category as FolderCategory,
          keywords: data.keywords || [],
          content: data.content,
          isFavorite: data.isFavorite || false,
          attachments: data.attachments || [], // Sync attachments
          createdAt: data.createdAt, 
        });
      });
      
      // Sort: Newest first by default, but specific components sort themselves
      setExperiences(fetchedExperiences);
      setIsOfflineMode(false);
    }, (error) => {
        if (error.code === 'permission-denied') {
            console.warn("Firestore access denied. Activating Offline Mode.");
            setIsOfflineMode(true);
            // Mock Data
            setExperiences([
                {
                    id: 'mock-1',
                    title: '교내 해커톤 대상 수상',
                    dateRange: '2024.05',
                    year: 2024,
                    summary: '24시간 동안 핀테크 앱 프로토타입을 개발하여 대상을 수상함.',
                    category: FolderCategory.COMPETITION,
                    keywords: ['해커톤', '핀테크'],
                    content: { overview: '', role: '팀장', skills_used: ['React'], outcomes: ['대상'], learned: '협업' },
                    isFavorite: true,
                    attachments: []
                },
                {
                    id: 'mock-2',
                    title: '스타트업 하계 인턴',
                    dateRange: '2023.07 - 2023.08',
                    year: 2023,
                    summary: '데이터 분석 직무로 2개월간 근무하며 고객 데이터를 분석함.',
                    category: FolderCategory.INTERNSHIP,
                    keywords: ['인턴', 'SQL'],
                    content: { overview: '', role: '인턴', skills_used: ['Python'], outcomes: ['리포트'], learned: '실무' },
                    isFavorite: false,
                    attachments: []
                }
            ]);
        }
    });

    const unsubscribeApp = onSnapshot(collection(db, appCollectionPath), (snapshot) => {
      const fetchedApps: JobApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedApps.push({
          id: doc.id,
          company: data.company,
          position: data.position,
          date: data.date,
          status: data.status,
          jobPostingUrl: data.jobPostingUrl,
          coverLetter: data.coverLetter,
          jobRole: data.jobRole,
          experienceLevel: data.experienceLevel,
          companyType: data.companyType,
          createdAt: data.createdAt
        });
      });
      setApplications(fetchedApps);
    }, (error) => {});

    return () => {
        unsubscribeExp();
        unsubscribeApp();
    };
  }, [userId]);

  const handleToggleTestMode = async () => {
      if (!user?.isAdmin) return;
      try {
        const configRef = doc(db, `artifacts/${APP_ID}/config`, 'global');
        await setDoc(configRef, { isTestMode: !globalConfig.isTestMode }, { merge: true });
      } catch (e) {
          setGlobalConfig(prev => ({ isTestMode: !prev.isTestMode }));
      }
  };

  const handleSaveExperience = async (newExp: Experience) => {
      if (!userId) return;
      
      if (isOfflineMode || userId.startsWith('demo-')) {
          setExperiences(prev => [newExp, ...prev]);
          return;
      }

      const collectionPath = `artifacts/${APP_ID}/users/${userId}/experiences`;
      const docData = { ...newExp, createdAt: Timestamp.now() };
      delete (docData as any).id; 
      
      try {
          await addDoc(collection(db, collectionPath), docData);
      } catch (e) {
          console.warn("Saving locally due to error:", e);
          setExperiences(prev => [newExp, ...prev]);
      }
  };

  const handleUpdateExperience = async (updatedExp: Experience) => {
      if (!userId) return;
      
      // Local update first
      setExperiences(prev => prev.map(e => e.id === updatedExp.id ? updatedExp : e));
      setSelectedExperience(updatedExp);

      if (isOfflineMode || userId.startsWith('demo-')) return;

      try {
          const docRef = doc(db, `artifacts/${APP_ID}/users/${userId}/experiences`, updatedExp.id);
          const data = { ...updatedExp };
          delete (data as any).id; 
          await setDoc(docRef, data, { merge: true });
      } catch (e) { console.error("Update failed", e); }
  };

  const handleDeleteExperience = async (id: string) => {
      if (!userId) return;
      
      setExperiences(prev => prev.filter(e => e.id !== id));
      if (selectedExperience?.id === id) setSelectedExperience(null);

      if (isOfflineMode || userId.startsWith('demo-')) return;

      try {
          await deleteDoc(doc(db, `artifacts/${APP_ID}/users/${userId}/experiences`, id));
      } catch (e) { console.error("Delete failed", e); }
  };

  const handleMoveExperience = async (id: string, newCategory: FolderCategory) => {
      const exp = experiences.find(e => e.id === id);
      if (exp) handleUpdateExperience({ ...exp, category: newCategory });
  };

  const handleToggleFavorite = async (id: string) => {
      const exp = experiences.find(e => e.id === id);
      if (exp) handleUpdateExperience({ ...exp, isFavorite: !exp.isFavorite });
  };

  const handleSaveApplication = async (newApp: JobApplication) => {
      if (!userId) return;
      
      if (isOfflineMode || userId.startsWith('demo-')) {
          setApplications(prev => [newApp, ...prev]);
          return;
      }

      try {
          const collectionPath = `artifacts/${APP_ID}/users/${userId}/applications`;
          await addDoc(collection(db, collectionPath), { ...newApp, createdAt: Timestamp.now() });
      } catch (e) {
          setApplications(prev => [newApp, ...prev]);
      }
  };

  const handleDemoLogin = (email: string, name: string) => {
      const demoUser: User = { name, email, avatarUrl: "", isAdmin: email === "admin@uos.ac.kr" };
      setUser(demoUser);
      setUserId(`demo-${email.replace(/[^a-zA-Z0-9]/g, '')}`);
      setIsOfflineMode(true);
  };

  // Login Props
  const handleLoginProps = {
      onEmailLogin: async (e: string, p: string) => { 
        try { await signInWithEmailAndPassword(auth, e, p); } 
        catch(err: any) { if(err.code === 'auth/operation-not-allowed') { alert("⚠️ 데모 모드 전환"); handleDemoLogin(e, 'Demo User'); } else alert("로그인 실패: " + err.message); } 
      },
      onSignUp: async (e: string, p: string, n: string) => { 
        try { const r = await createUserWithEmailAndPassword(auth, e, p); if(r?.user) await updateProfile(r.user, {displayName: n}); } 
        catch(err: any) { if(err.code === 'auth/operation-not-allowed') { alert("⚠️ 데모 모드 전환"); handleDemoLogin(e, n); } else alert("가입 실패: " + err.message); } 
      },
      onGoogleLogin: async () => { 
        try { await signInWithPopup(auth, new GoogleAuthProvider()); } 
        catch(err: any) { if(err.code === 'auth/unauthorized-domain') { alert("⚠️ 데모 모드 전환"); handleDemoLogin('demo@google.com', 'Google Demo'); } else alert("구글 로그인 실패: " + err.message); } 
      },
      onPasswordReset: async (e: string) => { await sendPasswordResetEmail(auth, e); },
      isGoogleLoading: false,
      isAuthLoading: false
  };

  if (isAuthChecking) return <div className="flex justify-center items-center h-screen"><div className="animate-spin w-10 h-10 border-4 border-orange-500 rounded-full border-t-transparent"></div></div>;

  if (!user) {
      if (!showLogin) return <LandingPage onLoginClick={() => setShowLogin(true)} />;
      return <Login {...handleLoginProps} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'main_input':
        return <MainInput onAnalyze={analyzeExperienceWithGemini} onModify={modifyExperienceWithGemini} onSave={handleSaveExperience} isLoading={isProcessing} />;
      case 'storage':
        return <Storage experiences={experiences} onSelectExperience={(e) => {setSelectedExperience(e); setCurrentPage('detail_view');}} onDelete={handleDeleteExperience} onMove={handleMoveExperience} onToggleFavorite={handleToggleFavorite} />;
      case 'timeline':
        return <Timeline experiences={experiences} onSelectExperience={(e) => {setSelectedExperience(e); setCurrentPage('detail_view');}} />;
      case 'detail_view':
        return selectedExperience ? <DetailView experience={selectedExperience} onBack={() => setCurrentPage('storage')} onToggleFavorite={handleToggleFavorite} onUpdate={handleUpdateExperience} /> : null;
      case 'applications':
        return <Applications applications={applications} onAdd={handleSaveApplication} onUpdate={()=>{}} onDelete={()=>{}} onNavigate={setCurrentPage} />;
      case 'cover_letter':
        return <CoverLetter experiences={experiences} isAdmin={user.isAdmin} onSaveApplication={handleSaveApplication} onNavigate={setCurrentPage} />;
      case 'recommendations':
        return <Recommendations experiences={experiences} isAdmin={user.isAdmin} globalConfig={globalConfig} onToggleTestMode={handleToggleTestMode} />;
      case 'job_news':
        return <JobNews isAdmin={user.isAdmin} jobNews={jobNewsList} onUpdateJobNews={setJobNewsList} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar user={user} totalCards={experiences.length} onLogout={() => {signOut(auth); setUser(null); setShowLogin(false);}} />
        <main className="flex-1 overflow-auto relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;