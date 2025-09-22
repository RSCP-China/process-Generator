import React, { useState, useEffect, useRef } from 'react';
import { type Task, type IconName, ICON_NAMES, type EditingItem } from '../types';
import { ICONS } from '../constants';

interface EditModalProps {
  isOpen: boolean;
  item: EditingItem | null;
  onClose: () => void;
  onSave: (data: Partial<Task & { title: string }>) => void;
  onDelete: () => void;
}

const IconButton: React.FC<{
  iconName: IconName;
  isSelected: boolean;
  onClick: () => void;
}> = ({ iconName, isSelected, onClick }) => {
    const IconComponent = ICONS[iconName];
    const baseClasses = "flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all w-24 h-24";
    const selectedClasses = "bg-indigo-100 border-indigo-500 text-indigo-600 shadow-md";
    const unselectedClasses = "bg-white border-slate-300 hover:border-indigo-400 hover:bg-slate-50 text-slate-600";
    
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
        >
            <IconComponent className="w-8 h-8 mb-1" />
            <span className="text-xs font-semibold uppercase">{iconName}</span>
        </button>
    );
};

const UploadIconButton: React.FC<{ onClick: () => void; }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed border-slate-400 cursor-pointer transition-all w-24 h-24 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 text-slate-500 hover:text-indigo-600"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    <span className="text-xs font-semibold uppercase">上传</span>
  </button>
);

const CustomIconButton: React.FC<{
  iconUrl: string;
  isSelected: boolean;
  onClick: () => void;
  onClear: () => void;
}> = ({ iconUrl, isSelected, onClick, onClear }) => {
    const baseClasses = "relative flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all w-24 h-24";
    const selectedClasses = "bg-indigo-100 border-indigo-500 shadow-md";
    const unselectedClasses = "bg-white border-slate-300 hover:border-indigo-400 hover:bg-slate-50";

    const handleClearClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClear();
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
        >
            <img src={iconUrl} alt="Custom Icon" className="w-12 h-12 object-contain" />
            <span className="mt-1 text-xs font-semibold uppercase text-slate-600">自定义</span>
            <button
                type="button"
                onClick={handleClearClick}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors z-10"
                aria-label="Remove custom icon"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </button>
    );
};

const MODAL_TITLES = {
  task: '编辑任务',
  role: '编辑角色',
  step: '编辑步骤',
};

export const EditModal: React.FC<EditModalProps> = ({ isOpen, item, onClose, onSave, onDelete }) => {
  // Common state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Task-specific state
  const [selectedIcon, setSelectedIcon] = useState<string>('TASK');
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && item) {
        if (item.type === 'task') {
            setDescription(item.data?.description || '');
            if (item.data?.icon) {
                const isPredefined = (ICON_NAMES as readonly string[]).includes(item.data.icon);
                if (isPredefined) {
                    setSelectedIcon(item.data.icon);
                    setCustomIcon(null);
                } else {
                    setSelectedIcon(item.data.icon);
                    setCustomIcon(item.data.icon);
                }
            } else {
                setSelectedIcon('TASK');
                setCustomIcon(null);
            }
        } else if (item.type === 'role' || item.type === 'step') {
            setTitle(item.data?.title || '');
            setDescription(item.data?.description || '');
        }
    }
  }, [isOpen, item]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (item?.type === 'task') {
        if (description.trim()) {
            onSave({ description, icon: selectedIcon });
        }
    } else if (item?.type === 'role' || item?.type === 'step') {
        if (title.trim()) {
            onSave({ title, description });
        }
    }
  };

  const handleDelete = () => {
      if (window.confirm('您确定要删除此任务吗？')) {
          onDelete();
      }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 1024 * 1024) { // 1MB limit
            alert("图片大小不能超过 1MB。");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setCustomIcon(dataUrl);
            setSelectedIcon(dataUrl);
        };
        reader.onerror = () => {
            alert("读取文件时出错。");
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleClearCustomIcon = () => {
    setCustomIcon(null);
    if (selectedIcon === customIcon) {
        setSelectedIcon('TASK');
    }
  };

  if (!isOpen || !item) return null;
  
  const modalTitle = MODAL_TITLES[item.type] || '编辑项目';

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
            <h2 className="text-xl font-bold text-slate-800">{item.type === 'task' && !item.data ? '创建新任务' : modalTitle}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
            </button>
        </div>
        
        <form onSubmit={handleSave}>
            {item.type === 'task' ? (
                <>
                    <div className="mb-6">
                        <label htmlFor="task-description" className="block text-sm font-bold text-slate-700 mb-2">任务描述</label>
                        <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简要描述此任务..." className="w-full h-28 p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm" required />
                    </div>
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-3">选择图标</label>
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            {ICON_NAMES.map((iconName) => (<IconButton key={iconName} iconName={iconName} isSelected={selectedIcon === iconName} onClick={() => setSelectedIcon(iconName)} />))}
                            {customIcon && (<CustomIconButton iconUrl={customIcon} isSelected={selectedIcon === customIcon} onClick={() => setSelectedIcon(customIcon)} onClear={handleClearCustomIcon} />)}
                            <UploadIconButton onClick={() => fileInputRef.current?.click()} />
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/gif" onChange={handleFileChange} />
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-4">
                        <label htmlFor="item-title" className="block text-sm font-bold text-slate-700 mb-2">标题</label>
                        <input type="text" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="item-description" className="block text-sm font-bold text-slate-700 mb-2">描述</label>
                        <textarea id="item-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm" />
                    </div>
                </>
            )}
          
          <div className="flex flex-col sm:flex-row-reverse gap-3">
             <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              保存更改
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              取消
            </button>
            {item.type === 'task' && item.data && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full sm:w-auto sm:mr-auto inline-flex justify-center rounded-xl border border-transparent bg-red-100 px-6 py-3 text-base font-bold text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                >
                    删除任务
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};