
import React from 'react';
import { InquiryData } from '../types';

interface LeadDetailModalProps {
  lead: InquiryData | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const DetailItem = ({ label, value, icon }: { label: string, value?: string, icon: React.ReactNode }) => {
    if (!value) return null;
    return (
      <div className="flex gap-3 py-3 border-b border-slate-50 last:border-0">
        <div className="mt-1 text-slate-400">{icon}</div>
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
          <div className="text-slate-700 font-medium break-words">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-slide-in-right"
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
              {lead.companyName?.charAt(0) || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{lead.companyName}</h2>
              <p className="text-slate-500 text-sm font-medium">{lead.contactPerson}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-2 px-1">Contact Information</h3>
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <DetailItem 
                label="Designation" 
                value={lead.designation} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
              />
              <DetailItem 
                label="Mobile Number" 
                value={lead.contactNumber} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} 
              />
              <DetailItem 
                label="Telephone" 
                value={lead.telephoneNumber} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} 
              />
              <DetailItem 
                label="Email Address" 
                value={lead.emailId} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
              />
              <DetailItem 
                label="Website" 
                value={lead.website} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>} 
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-2 px-1">Addresses</h3>
            <div className="space-y-3">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Corporate Office</div>
                <p className="text-slate-700 leading-relaxed text-sm">{lead.corporateAddress || 'Not provided'}</p>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Factory Location</div>
                <p className="text-slate-700 leading-relaxed text-sm">{lead.factoryAddress || 'Not provided'}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-2 px-1">Inquiry Details</h3>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-slate-800 leading-relaxed text-sm italic">
                "{lead.inquiryRequirements || 'No specific requirements captured.'}"
              </p>
            </div>
          </section>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest text-center mb-4">
            Captured on {new Date(lead.timestamp).toLocaleString()}
          </div>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
