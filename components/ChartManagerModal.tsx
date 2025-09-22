import React, { useState } from 'react';

interface ChartManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCharts: string[];
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
  onSave: (name: string) => void;
  isChartLoaded: boolean;
}

export const ChartManagerModal: React.FC<ChartManagerModalProps> = ({ isOpen, onClose, savedCharts, onLoad, onDelete, onSave, isChartLoaded }) => {
  const [newName, setNewName] = useState('');
  
  if (!isOpen) return null;

  const handleDelete = (chartName: string) => {
    if (window.confirm(`Are you sure you want to delete "${chartName}"?`)) {
      onDelete(chartName);
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
        onSave(newName.trim());
        setNewName(''); // Clear after saving
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-slate-800">管理图表</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
            </button>
        </div>

        <form onSubmit={handleSaveSubmit} className="mb-6 border-b border-slate-200 pb-6">
            <h3 className="text-lg font-bold text-slate-700 mb-3">保存当前图表</h3>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="输入图表名称..."
                    className="flex-grow p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                    disabled={!isChartLoaded}
                />
                <button
                    type="submit"
                    disabled={!isChartLoaded || !newName.trim()}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    保存
                </button>
            </div>
            {!isChartLoaded && <p className="text-xs text-slate-500 mt-2">没有可保存的图表。</p>}
        </form>
        
        <h3 className="text-lg font-bold text-slate-700 mb-4">加载或删除图表</h3>
        {savedCharts.length > 0 ? (
          <div className="max-h-[40vh] overflow-y-auto pr-2 -mr-2">
            <ul className="space-y-3">
              {savedCharts.map(name => (
                <li key={name} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-medium text-slate-700">{name}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onLoad(name)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      加载
                    </button>
                    <button 
                      onClick={() => handleDelete(name)}
                      className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-4 text-slate-500">您还没有保存任何图表。</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
                关闭
            </button>
        </div>
      </div>
    </div>
  );
};