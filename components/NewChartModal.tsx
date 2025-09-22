import React, { useState, useRef } from 'react';

interface NewChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, image: { data: string; mimeType: string } | null) => void;
}

const ImagePreview: React.FC<{
  file: File;
  onClear: () => void;
}> = ({ file, onClear }) => {
  return (
    <div className="mt-4 p-3 border border-slate-300 rounded-xl bg-slate-50 relative">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <div className="text-sm">
          <p className="font-semibold text-slate-700">{file.name}</p>
          <p className="text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="absolute top-2 right-2 p-1 bg-slate-200 text-slate-600 rounded-full hover:bg-red-200 hover:text-red-700 transition-colors"
        aria-label="Remove image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
      </button>
    </div>
  );
};

export const NewChartModal: React.FC<NewChartModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !imageFile) {
      alert('Please provide a prompt or an image.');
      return;
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = (event.target?.result as string).split(',')[1];
            onGenerate(prompt, { data: base64String, mimeType: imageFile.type });
        };
        reader.onerror = () => {
          alert('Error reading file.');
        }
        reader.readAsDataURL(imageFile);
    } else {
        onGenerate(prompt, null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
        alert("Image size should not exceed 4MB.");
        return;
      }
      setImageFile(file);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-slate-800">创建新流程图</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
            </button>
        </div>
        <p className="text-slate-500 mb-6">描述您想要可视化的流程，或上传一张白板草图的照片。</p>
        
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-bold text-slate-700 mb-2">流程描述</label>
              <textarea 
                id="prompt" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="例如：'一个新客户的引导流程，涉及销售、项目管理和技术团队...'" 
                className="w-full h-36 p-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
              />
            </div>
            
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">上传图片（可选）</label>
                <div 
                    className="flex justify-center items-center w-full px-6 py-8 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-indigo-600">点击上传</span> 或拖放</p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 4MB</p>
                    </div>
                </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                 {imageFile && <ImagePreview file={imageFile} onClear={handleClearImage} />}
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-3">
               <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              >
                生成图表
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              >
                取消
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};