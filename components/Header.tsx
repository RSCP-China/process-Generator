
import React from 'react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#4f46e5"/>
    <path d="M12 12H18V18H12V12Z" fill="white"/>
    <path d="M22 22H28V28H22V22Z" fill="white"/>
    <path d="M18 15H28V18H18V15Z" fill="#a5b4fc"/>
    <path d="M15 18V28H12L12 18H15Z" fill="#a5b4fc"/>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              AI 流程图生成器
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};