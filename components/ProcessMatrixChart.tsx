import React, { useState } from 'react';
import { type ChartData, type Task, type EditingItem, ICON_NAMES, IconName } from '../types';
import { ICONS } from '../constants';

interface ProcessMatrixChartProps {
  data: ChartData;
  onEdit: (item: EditingItem) => void;
  onAddStep: () => void;
  onAddRole: () => void;
  onReorder: (type: 'role' | 'step', sourceIndex: number, destinationIndex: number) => void;
}

const AddButton: React.FC<{ onClick: () => void; ariaLabel: string }> = ({ onClick, ariaLabel }) => (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-slate-200 hover:bg-indigo-100 text-slate-500 hover:text-indigo-500 flex items-center justify-center transition-colors group"
      aria-label={ariaLabel}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
    </button>
);

const DragHandle: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 16 16">
        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
);


const TaskCell: React.FC<{
  task: Task | null;
  rowIndex: number;
  colIndex: number;
  onEdit: (item: EditingItem) => void;
}> = ({ task, rowIndex, colIndex, onEdit }) => {
  if (!task || !task.description) {
    return (
      <div className="h-full min-h-[120px] flex items-center justify-center p-2">
        <AddButton onClick={() => onEdit({ type: 'task', data: null, rowIndex, colIndex })} ariaLabel={`Add task at row ${rowIndex + 1}, column ${colIndex + 1}`} />
      </div>
    );
  }

  const isPredefinedIcon = (icon: string): icon is IconName => {
    return (ICON_NAMES as readonly string[]).includes(icon);
  };
  
  const IconComponent = isPredefinedIcon(task.icon) ? ICONS[task.icon] : null;

  return (
    <button
      onClick={() => onEdit({ type: 'task', data: task, rowIndex, colIndex })}
      className="bg-white hover:bg-indigo-50/50 w-full h-full text-left p-3 rounded-lg shadow-sm hover:shadow-md transition-all border border-slate-200 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div className="flex-shrink-0 mb-2">
        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-indigo-500" />
        ) : (
          <img src={task.icon} alt="Custom task icon" className="w-8 h-8 object-contain" />
        )}
      </div>
      <p className="text-xs sm:text-sm text-slate-700 leading-snug">{task.description}</p>
    </button>
  );
};

export const ProcessMatrixChart: React.FC<ProcessMatrixChartProps> = ({ data, onEdit, onAddStep, onAddRole, onReorder }) => {
  const [draggedItem, setDraggedItem] = useState<{ type: 'role' | 'step'; index: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ type: 'role' | 'step'; index: number } | null>(null);

  if (!data) return null;
  
  const handleDragStart = (e: React.DragEvent, type: 'role' | 'step', index: number) => {
    setDraggedItem({ type, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, index })); // For Firefox
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (e: React.DragEvent, type: 'role' | 'step', index: number) => {
    if (draggedItem && draggedItem.type === type && draggedItem.index !== index) {
      setDropTarget({ type, index });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
     // Check if the relatedTarget is outside the component bounds
    const componentRoot = (e.currentTarget as HTMLElement);
    if (!componentRoot.contains(e.relatedTarget as Node)) {
        setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'role' | 'step', dropIndex: number) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === type && draggedItem.index !== dropIndex) {
      onReorder(type, draggedItem.index, dropIndex);
    }
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const gridCols = `grid-cols-[minmax(120px,1.5fr)_repeat(${data.steps.length},_minmax(150px,2fr))_auto]`;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 text-center">
          {data.title}
      </h2>

      <div className={`grid ${gridCols} gap-2 items-start`} onDragLeave={handleDragLeave}>
        {/* Top-left empty cell */}
        <div />

        {/* Step headers */}
        {data.steps.map((step, index) => (
          <div 
            key={`step-${index}`} 
            draggable
            onDragStart={(e) => handleDragStart(e, 'step', index)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, 'step', index)}
            onDrop={(e) => handleDrop(e, 'step', index)}
            onDragEnd={handleDragEnd}
            className={`p-3 rounded-lg bg-slate-100 flex items-start justify-between cursor-grab group transition-all duration-200 ${draggedItem?.type === 'step' && draggedItem.index === index ? 'opacity-40' : ''} ${dropTarget?.type === 'step' && dropTarget.index === index ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <div className="flex-grow">
                <button onClick={() => onEdit({ type: 'step', data: step, index })} className="w-full text-left font-bold text-slate-700 hover:text-indigo-600 transition-colors group">
                    <h3 className="text-sm sm:text-base group-hover:underline">{step.title}</h3>
                </button>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{step.description}</p>
            </div>
             <div className="pl-2 pt-1 flex-shrink-0">
                <DragHandle />
            </div>
          </div>
        ))}
        
        {/* Add Step Button Cell */}
        <div className="p-3 flex items-center justify-center h-full">
            <AddButton onClick={onAddStep} ariaLabel="Add new step" />
        </div>


        {/* Rows with Role headers and Task cells */}
        {data.roles.map((role, rowIndex) => (
          <React.Fragment key={`role-row-${rowIndex}`}>
            {/* Role header */}
            <div 
                className={`p-3 rounded-lg bg-slate-100 flex items-center h-full cursor-grab group transition-all duration-200 ${draggedItem?.type === 'role' && draggedItem.index === rowIndex ? 'opacity-40' : ''} ${dropTarget?.type === 'role' && dropTarget.index === rowIndex ? 'ring-2 ring-indigo-500' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, 'role', rowIndex)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, 'role', rowIndex)}
                onDrop={(e) => handleDrop(e, 'role', rowIndex)}
                onDragEnd={handleDragEnd}
            >
              <div className="flex-grow">
                <button onClick={() => onEdit({ type: 'role', data: role, index: rowIndex })} className="w-full text-left font-bold text-slate-700 hover:text-indigo-600 transition-colors group">
                    <h3 className="text-sm sm:text-base group-hover:underline">{role.title}</h3>
                </button>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{role.description}</p>
              </div>
               <div className="pl-2 flex-shrink-0">
                    <DragHandle />
                </div>
            </div>

            {/* Task cells for the role */}
            {data.tasks[rowIndex].map((task, colIndex) => (
              <div key={`task-${rowIndex}-${colIndex}`} className="bg-slate-50/70 rounded-lg p-1">
                <TaskCell task={task} rowIndex={rowIndex} colIndex={colIndex} onEdit={onEdit} />
              </div>
            ))}
            {/* Empty cell for the "Add Step" column */}
            <div />
          </React.Fragment>
        ))}

        {/* Add Role Button Row */}
        <div className="p-3 flex items-center justify-center">
            <AddButton onClick={onAddRole} ariaLabel="Add new role" />
        </div>
        <div className={`col-span-${data.steps.length + 1}`} />

      </div>
    </div>
  );
};