import { useState, useEffect } from 'react';
import MobileTaskMoveModal from './MobileTaskMoveModal';
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

  const TaskCard = ({ task, onEdit, onDelete, onCardClick, onMobileMove }) => {
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobileView(window.innerWidth < 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // Desktop drag handlers
    const handleDragStart = (e) => {
        if (window.innerWidth < 768) {
          e.preventDefault();
          setShowMoveModal(true);
        } else {
          e.dataTransfer.setData('taskId', task.id);
        }
      };
  

  
    // See more button handler
    const handleSeeMoreClick = (e) => {
      e.stopPropagation();
      onCardClick(task);
    };
  
    return (
      <>
        <div
          draggable
          onDragStart={handleDragStart}

          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3 cursor-pointer 
            hover:bg-gray-50 dark:hover:bg-gray-700 ${isDragging ? 'opacity-50' : 'opacity-100'}
            ${isMobileView ? 'touch-manipulation' : ''}`}
        >
          <div className='h-12'>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
            {task.dueDate && (
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button 
              onClick={handleSeeMoreClick}
              className="items-center justify-center text-blue-700 hover:text-blue-800 transition-colors"
            >
              See more
              <MdKeyboardDoubleArrowDown className="inline ml-1" />
            </button>
          </div>
        </div>
  
        <MobileTaskMoveModal
          isOpen={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          onMove={onMobileMove}
          task={task}
        />
      </>
    );
  };

export default TaskCard;