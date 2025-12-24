
import React, { useState, useEffect } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { RecordTable } from './components/RecordTable';
import { Auth } from './components/Auth';
import { InquiryData, ExtractionStatus, User } from './types';
import { extractInquiryData } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<InquiryData[]>([]);
  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('madhusudan_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
      } catch (e) {
        console.error("Auth restoration failed");
      }
    }
    setIsInitialized(true);
  }, []);

  // Load user records when user changes
  useEffect(() => {
    if (user) {
      const savedLeads = localStorage.getItem(`leads_${user.email}`);
      if (savedLeads) {
        try {
          setRecords(JSON.parse(savedLeads));
        } catch (e) {
          console.error("Data restoration failed");
        }
      } else {
        setRecords([]);
      }
    }
  }, [user]);

  // Persist records to user-specific local storage
  useEffect(() => {
    if (user && isInitialized) {
      localStorage.setItem(`leads_${user.email}`, JSON.stringify(records));
    }
  }, [records, user, isInitialized]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('madhusudan_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    if (confirm("Sign out of your Madhusudan Group session?")) {
      setUser(null);
      setIsMobileMenuOpen(false);
      localStorage.removeItem('madhusudan_user');
    }
  };

  const handleCapture = async (images: string[]) => {
    setStatus('extracting');
    setError(null);
    try {
      const extracted = await extractInquiryData(images);
      const newRecord = {
        ...extracted,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      } as InquiryData;
      
      setRecords(prev => [newRecord, ...prev]);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to extract data. Please try clearer photos.");
      setStatus('error');
    }
  };

  const deleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this lead from your profile?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  if (!isInitialized) return null;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const totalLeads = records.length;
  const todayLeads = records.filter(r => {
    const today = new Date().setHours(0,0,0,0);
    return r.timestamp >= today;
  }).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      {/* Corporate Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase truncate">Madhusudan</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent: {user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Desktop Logout */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Lead Intelligence Agent</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <button 
              onClick={() => setStatus('capturing')}
              className="hidden sm:flex px-6 py-3 bg-indigo-900 text-white rounded-xl font-bold hover:bg-indigo-800 transition shadow-lg shadow-indigo-100 active:scale-95 items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Initiate Scan
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{user.fullName}</h3>
                <p className="text-slate-500 font-medium text-sm">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => { setStatus('capturing'); setIsMobileMenuOpen(false); }}
                className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                New Multi-Side Scan
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout Account
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Summary Section */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lead Console</h2>
            <p className="text-slate-500 font-medium mt-1">Combine multiple photos for comprehensive data extraction.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Records</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalLeads}</p>
            </div>
            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Scanned Today</p>
              <p className="text-3xl font-black text-slate-900 mt-1 text-emerald-600">+{todayLeads}</p>
            </div>
            <div className="hidden md:block bg-indigo-900 p-6 rounded-[24px] text-white shadow-xl shadow-indigo-100">
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Status</p>
              <p className="text-lg font-bold mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Secure Session
              </p>
              <p className="text-[10px] text-indigo-200 mt-1 opacity-60">Verified {user.email}</p>
            </div>
            <div className="hidden md:block bg-[#F8FAFC] p-6 rounded-[24px] border border-slate-100">
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">AI Multi-Scan</p>
               <p className="text-lg font-bold text-slate-900 mt-2">Active</p>
               <p className="text-[10px] text-slate-400 mt-1">Supports Front/Back Cards</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-3xl text-red-700 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-bold">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <RecordTable records={records} onDelete={deleteRecord} />
      </main>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-8 right-6 sm:hidden z-40">
        <button 
          onClick={() => setStatus('capturing')}
          className="w-16 h-16 bg-indigo-900 text-white rounded-[24px] shadow-2xl shadow-indigo-300 flex items-center justify-center active:scale-90 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <footer className="mt-20 py-12 border-t border-slate-200 text-center px-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Madhusudan Group • AI Solutions</p>
        <p className="text-slate-300 text-[10px] leading-relaxed max-w-xs mx-auto">
          Confidential enterprise data. Your captures are unique to your email profile across this device.
        </p>
      </footer>

      {status === 'capturing' && (
        <CameraCapture 
          onCapture={handleCapture}
          onCancel={() => setStatus('idle')}
        />
      )}

      {status === 'extracting' && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 text-white">
          <div className="w-24 h-24 mb-10 relative">
            <div className="absolute inset-0 border-[6px] border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full border-t-transparent animate-spin shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3">Analyzing Photos...</h2>
          <p className="text-indigo-200 max-w-xs font-medium text-lg leading-relaxed">
            Gemini is merging data from multiple images into your profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
