
import React, { useState } from 'react';
import { InquiryData } from '../types';
import { LeadDetailModal } from './LeadDetailModal';

interface RecordTableProps {
  records: InquiryData[];
  onDelete: (id: string) => void;
}

export const RecordTable: React.FC<RecordTableProps> = ({ records, onDelete }) => {
  const [selectedLead, setSelectedLead] = useState<InquiryData | null>(null);

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 p-16 sm:p-24 text-center max-w-3xl mx-auto">
        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-900">Start Scanning Leads</h3>
        <p className="text-slate-400 mt-3 font-medium max-w-sm mx-auto leading-relaxed">
          Capture business cards or inquiry forms to build your professional Madhusudan Group pipeline.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    const headers = ['Company', 'Contact', 'Designation', 'Email', 'Phone', 'Requirements'];
    const csvContent = [
      headers.join(','),
      ...records.map(r => [
        `"${r.companyName}"`, 
        `"${r.contactPerson}"`, 
        `"${r.designation}"`, 
        `"${r.emailId}"`, 
        `"${r.contactNumber}"`, 
        `"${r.inquiryRequirements.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `madhusudan_pipeline_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-8">
      <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Opportunities</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Lead Management Dashboard</p>
        </div>
        <button 
          onClick={handleExport}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all font-bold shadow-sm active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0L8 7m4-4l4 4" />
          </svg>
          Export Database
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {records.map((record) => (
          <div 
            key={record.id}
            onClick={() => setSelectedLead(record)}
            className="group relative bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6 sm:gap-10"
          >
            <div className="flex items-center gap-5 sm:gap-8 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-indigo-50 text-indigo-900 flex items-center justify-center font-black text-2xl sm:text-3xl flex-shrink-0 group-hover:bg-indigo-900 group-hover:text-white transition-colors duration-500 shadow-sm">
                {record.companyName?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl leading-tight truncate group-hover:text-indigo-900 transition-colors">
                  {record.companyName || 'Unknown Entity'}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-slate-600 font-bold text-sm">{record.contactPerson}</span>
                  <span className="hidden sm:block w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{record.designation || 'Contact'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-16 flex-1 md:justify-end border-t sm:border-t-0 border-slate-50 pt-6 sm:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12 w-full sm:w-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</span>
                  <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{record.emailId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</span>
                  <span className="text-sm font-semibold text-slate-700">{record.contactNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                  title="Remove Lead"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
