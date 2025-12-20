
import React, { useState } from 'react';
import { User, AuthView } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (view === 'signup') {
        setView('verify');
      } else if (view === 'login') {
        onLogin({
          id: crypto.randomUUID(),
          email,
          fullName: 'Madhusudan Employee',
          isVerified: true
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const simulateVerification = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: crypto.randomUUID(),
        email,
        fullName,
        isVerified: true
      });
      setIsLoading(false);
    }, 1000);
  };

  if (view === 'verify') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We've sent a verification link to <span className="font-semibold text-slate-800">{email}</span>. Please verify your account to continue.
          </p>
          <button 
            onClick={simulateVerification}
            disabled={isLoading}
            className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-800 transition active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Verify Account (Simulation)'}
          </button>
          <p className="mt-6 text-sm text-slate-400">
            Didn't receive an email? <button className="text-indigo-600 font-bold hover:underline">Resend</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Brand Side */}
      <div className="md:w-1/2 bg-indigo-950 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-black text-xl tracking-tight uppercase">Madhusudan Group</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
            Digitize your networking instantly.
          </h1>
          <p className="text-indigo-200 text-lg max-w-md leading-relaxed">
            The official lead capture tool for Madhusudan Group. Scan business cards and inquiry forms with enterprise-grade AI accuracy.
          </p>
        </div>
        
        <div className="relative z-10 text-indigo-400 text-sm font-medium">
          © {new Date().getFullYear()} Madhusudan Group. All rights reserved.
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </div>

      {/* Form Side */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {view === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {view === 'login' ? 'Access your lead pipeline' : 'Join the Madhusudan Group network'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                placeholder="email@madhusudangroup.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (view === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            {view === 'login' ? (
              <>Don't have an account? <button onClick={() => setView('signup')} className="text-indigo-600 font-bold hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
