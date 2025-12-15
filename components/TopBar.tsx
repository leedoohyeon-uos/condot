import React from 'react';
import { LogOut, FileStack } from 'lucide-react';
import { User } from '../types';

interface TopBarProps {
  user: User;
  totalCards: number;
  onLogout: () => void;
  onDeleteAccount?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, totalCards, onLogout, onDeleteAccount }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center text-sm text-gray-500">
         {/* Breadcrumb placeholder or current page title could go here */}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <FileStack size={16} className="text-orange-600" />
          <span className="text-xs font-semibold text-orange-700">{totalCards} Cards</span>
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <img 
            src={user.avatarUrl} 
            alt="Profile" 
            className="w-9 h-9 rounded-full border border-gray-200"
          />
          {onDeleteAccount && (
              <button 
                  onClick={onDeleteAccount}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  title="회원 탈퇴"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
          )}
          <button 
            onClick={onLogout}
            className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
            title="로그아웃"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;