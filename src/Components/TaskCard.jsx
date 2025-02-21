import { useState, useEffect } from 'react';
import MobileTaskMoveModal from './MobileTaskMoveModal';
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { Move } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onCardClick, onMobileMove }) => {
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (e) => {
    if (isMobileView) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSeeMoreClick = (e) => {
    e.stopPropagation();
    onCardClick(task);
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    setShowMoveModal(true);
  };

  return (
    <>
      <div
        draggable={!isMobileView}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3 cursor-pointer 
          hover:bg-gray-50 dark:hover:bg-gray-700 ${isDragging ? 'opacity-50' : 'opacity-100'}
          relative`}
      >
        {/* Move button for mobile */}
        {isMobileView && (
          <button
            onClick={handleMoveClick}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 
              dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Move task"
          >
            <Move size={16} />
          </button>
        )}

        <div className="h-12 pr-8"> 
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {task.title}
          </h3>
          {task.dueDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center mt-2">
          <button 
            onClick={handleSeeMoreClick}
            className="text-sky-700 dark:text-blue-400 hover:text-blue-700 
              dark:hover:text-blue-300 transition-colors flex items-center"
          >
            See more
            <MdKeyboardDoubleArrowDown className="ml-1" />
          </button>
        </div>
      </div>

      <MobileTaskMoveModal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        onMove={(taskId, category) => {
          onMobileMove(taskId, category);
          setShowMoveModal(false);
        }}
        task={task}
      />
    </>
  );
};

export default TaskCard;