import React from 'react';

interface ControlsProps {
  onNewChart: () => void;
  onManageCharts: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onNewChart, onManageCharts }) => {
  
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <p className="text-sm font-semibold text-slate-600 hidden md:block">需要新图表？</p>
        <button
          onClick={onNewChart}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          用 AI 创建
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onManageCharts}
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          管理已保存图表
        </button>
      </div>
    </div>
  );
};