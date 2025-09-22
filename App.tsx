import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { ProcessMatrixChart } from './components/ProcessMatrixChart';
import { EditModal } from './components/EditModal';
import { NewChartModal } from './components/NewChartModal';
import { ChartManagerModal } from './components/ChartManagerModal';
import { generateProcessChart } from './services/geminiService';
import { INITIAL_CHART_DATA } from './constants';
import { type ChartData, type EditingItem, type Task, type Role, type Step } from './types';

const App: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(INITIAL_CHART_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isNewChartModalOpen, setIsNewChartModalOpen] = useState<boolean>(false);
  const [isChartManagerOpen, setIsChartManagerOpen] = useState<boolean>(false);

  // Load saved charts from local storage on mount
  const [savedCharts, setSavedCharts] = useState<Record<string, ChartData>>({});
  useEffect(() => {
    try {
      const storedCharts = localStorage.getItem('savedProcessCharts');
      if (storedCharts) {
        setSavedCharts(JSON.parse(storedCharts));
      }
    } catch (e) {
      console.error("Failed to load charts from local storage", e);
    }
  }, []);

  const handleGenerateChart = async (prompt: string, image: { data: string; mimeType: string } | null) => {
    setIsNewChartModalOpen(false);
    setIsLoading(true);
    setError(null);
    setChartData(null);

    try {
      const data = await generateProcessChart(prompt, image);
      setChartData(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditItem = (item: EditingItem) => {
    setEditingItem(item);
  };
  
  const handleCloseModal = () => {
    setEditingItem(null);
  };
  
  const handleSaveItem = (updatedData: Partial<Task & Role & Step>) => {
    if (!editingItem || !chartData) return;

    const newChartData = JSON.parse(JSON.stringify(chartData)); // Deep copy

    switch (editingItem.type) {
      case 'task':
        if (newChartData.tasks[editingItem.rowIndex][editingItem.colIndex] === null) {
          newChartData.tasks[editingItem.rowIndex][editingItem.colIndex] = { description: '', icon: 'TASK' };
        }
        Object.assign(newChartData.tasks[editingItem.rowIndex][editingItem.colIndex], updatedData);
        break;
      case 'role':
        Object.assign(newChartData.roles[editingItem.index], updatedData);
        break;
      case 'step':
        Object.assign(newChartData.steps[editingItem.index], updatedData);
        break;
    }
    
    setChartData(newChartData);
    handleCloseModal();
  };
  
  const handleDeleteItem = () => {
    if (!editingItem || !chartData || editingItem.type !== 'task') return;
    
    const newChartData = JSON.parse(JSON.stringify(chartData));
    newChartData.tasks[editingItem.rowIndex][editingItem.colIndex] = null;
    
    setChartData(newChartData);
    handleCloseModal();
  };

  const handleSaveChart = (name: string) => {
    if (!chartData) return;
    const newSavedCharts = { ...savedCharts, [name]: chartData };
    setSavedCharts(newSavedCharts);
    localStorage.setItem('savedProcessCharts', JSON.stringify(newSavedCharts));
    alert(`Chart "${name}" saved!`);
  };

  const handleLoadChart = (name: string) => {
    const chartToLoad = savedCharts[name];
    if (chartToLoad) {
      setChartData(chartToLoad);
      setIsChartManagerOpen(false);
    }
  };

  const handleDeleteSavedChart = (name: string) => {
    const { [name]: _, ...remainingCharts } = savedCharts;
    setSavedCharts(remainingCharts);
    localStorage.setItem('savedProcessCharts', JSON.stringify(remainingCharts));
  };

  const handleAddStep = () => {
    if (!chartData) return;
    const newChartData = JSON.parse(JSON.stringify(chartData));
    
    // Add new step
    newChartData.steps.push({ title: '新步骤', description: '点击编辑' });
    
    // Add null task to each role's task list
    newChartData.tasks.forEach((taskRow: (Task | null)[]) => {
      taskRow.push(null);
    });
    
    setChartData(newChartData);
  };

  const handleAddRole = () => {
    if (!chartData) return;
    const newChartData = JSON.parse(JSON.stringify(chartData));

    // Add new role
    newChartData.roles.push({ title: '新团队', description: '点击编辑' });

    // Add new task row filled with nulls
    const newTasksRow = Array(newChartData.steps.length).fill(null);
    newChartData.tasks.push(newTasksRow);

    setChartData(newChartData);
  };
  
  const handleReorder = (type: 'role' | 'step', sourceIndex: number, destinationIndex: number) => {
    if (!chartData) return;

    const newChartData = JSON.parse(JSON.stringify(chartData));

    if (type === 'role') {
      const [movedRole] = newChartData.roles.splice(sourceIndex, 1);
      newChartData.roles.splice(destinationIndex, 0, movedRole);

      const [movedTaskRow] = newChartData.tasks.splice(sourceIndex, 1);
      newChartData.tasks.splice(destinationIndex, 0, movedTaskRow);
    } else { // type === 'step'
      const [movedStep] = newChartData.steps.splice(sourceIndex, 1);
      newChartData.steps.splice(destinationIndex, 0, movedStep);

      newChartData.tasks.forEach((row: (Task | null)[]) => {
        const [movedTask] = row.splice(sourceIndex, 1);
        row.splice(destinationIndex, 0, movedTask);
      });
    }

    setChartData(newChartData);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Controls 
          onNewChart={() => setIsNewChartModalOpen(true)}
          onManageCharts={() => setIsChartManagerOpen(true)}
        />
        
        <div className="mt-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
               <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-slate-700">正在生成图表...</h3>
              <p className="text-slate-500 mt-2">AI 正在处理您的请求。请稍候。</p>
            </div>
          )}
          {error && (
            <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-2xl shadow-md">
              <h3 className="font-bold text-lg mb-2">出错了</h3>
              <p>{error}</p>
            </div>
          )}
          {chartData && !isLoading && (
            <ProcessMatrixChart 
              data={chartData} 
              onEdit={handleEditItem}
              onAddStep={handleAddStep}
              onAddRole={handleAddRole}
              onReorder={handleReorder}
            />
          )}
        </div>
      </main>

      <EditModal 
        isOpen={!!editingItem}
        item={editingItem}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />
      
      <NewChartModal
        isOpen={isNewChartModalOpen}
        onClose={() => setIsNewChartModalOpen(false)}
        onGenerate={handleGenerateChart}
      />

      <ChartManagerModal
        isOpen={isChartManagerOpen}
        onClose={() => setIsChartManagerOpen(false)}
        savedCharts={Object.keys(savedCharts)}
        onLoad={handleLoadChart}
        onDelete={handleDeleteSavedChart}
        onSave={handleSaveChart}
        isChartLoaded={!!chartData}
      />
    </div>
  );
};

export default App;