import React, { useState } from 'react';
import { Loader2, Mail, Lock, User as UserIcon, ArrowLeft, CheckSquare } from 'lucide-react';

interface LoginProps {
  onEmailLogin: (email: string, pass: string) => Promise<void>;
  onSignUp: (email: string, pass: string, name: string) => Promise<void>;
  onGoogleLogin: () => void;
  onPasswordReset: (email: string) => Promise<void>;
  isGoogleLoading: boolean;
  isAuthLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ 
  onEmailLogin, 
  onSignUp, 
  onGoogleLogin, 
  onPasswordReset,
  isGoogleLoading,
  isAuthLoading 
}) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetMode) {
        if (!email) return;
        await onPasswordReset(email);
        setIsResetMode(false);
        return;
    }

    if (!email || !password) return;
    
    if (isSignUpMode) {
      if (!name) return;
      if (!isConsentChecked) {
          alert("개인정보 수집 및 이용에 동의해주셔야 가입이 가능합니다.");
          return;
      }
      await onSignUp(email, password, name);
    } else {
      await onEmailLogin(email, password);
    }
  };

  const isLoading = isGoogleLoading || isAuthLoading;

  // Password Reset View
  if (isResetMode) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
                <button onClick={() => setIsResetMode(false)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft size={18} className="mr-2"/> 돌아가기
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">비밀번호 재설정</h2>
                <p className="text-gray-500 mb-6">가입한 이메일 주소를 입력하시면 재설정 링크를 보내드립니다.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium shadow-md mt-4 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : '재설정 메일 보내기'}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tighter">CONDOT<span className="text-orange-500">.</span></h1>
          <p className="text-gray-500">한 줄의 경험으로 시작하는 커리어 아카이브</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUpMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="홍길동"
                  required={isSignUpMode}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="********"
                required
              />
            </div>
          </div>

          {!isSignUpMode && (
              <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsResetMode(true)}
                    className="text-xs text-gray-500 hover:text-orange-600 underline"
                  >
                      비밀번호를 잊으셨나요?
                  </button>
              </div>
          )}

          {/* Privacy Consent Checkbox */}
          {isSignUpMode && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2">
                  <div className="h-24 overflow-y-auto pr-1 leading-relaxed">
                      <p className="font-bold mb-1">[개인정보 수집 및 이용 동의]</p>
                      <p>
                        [2025-2학기 조경학과 개강총회 참가 신청] 시 참가자 파악을 목적으로 개인정보를 제공하는 것이 필요함을 이해합니다. 
                        '개인정보 보호법' 등 관련 규정에 따라 다음의 개인정보를 수집 및 이용하는 것에 동의합니다:
                      </p>
                      <ul className="list-disc list-inside mt-1 pl-1">
                          <li>가. 성명</li>
                          <li>나. 휴대전화번호</li>
                          <li>다. 기타 개인정보</li>
                      </ul>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer mt-2 pt-2 border-t border-gray-200">
                      <input 
                        type="checkbox" 
                        checked={isConsentChecked}
                        onChange={(e) => setIsConsentChecked(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span className="font-bold text-gray-800">위 개인정보 수집 및 이용에 동의합니다.</span>
                  </label>
              </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (isSignUpMode && !isConsentChecked)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUpMode ? '동의하고 회원가입' : '로그인')}
          </button>
        </form>
        
        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400">또는</span>
            </div>
        </div>

        <button 
            onClick={onGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-70"
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium">Google 계정으로 계속하기</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {isSignUpMode ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}
            <button 
              onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setIsConsentChecked(false); // Reset consent on toggle
              }}
              className="ml-2 font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2"
            >
              {isSignUpMode ? '로그인하기' : '회원가입하기'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;