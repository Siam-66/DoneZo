import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PiSortAscendingLight, PiSortDescendingLight } from "react-icons/pi";
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';

const TaskColumn = ({ title, tasks, onDrop, onEdit, onDelete, onMobileMove, onAddTask, }) => {
  const filteredTasks = tasks.filter(task => task.category === title);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('taskId');
      onDrop(taskId, title);
    };
  
    const handleAddTask = (taskData) => {
      onAddTask({ ...taskData, category: title });
      setShowAddTaskModal(false);
    };
  
    const handleCardClick = (task) => {
      setSelectedTask(task);
      setShowTaskDetail(true);
    };
  
    const toggleSortOrder = () => {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };
  
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    });
  
    return (
      <>
        <div 
          className="bg-gray-200 dark:bg-gray-900 p-4 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-200 dark:bg-gray-900">
            <h2 className="font-bold text-gray-700 dark:text-gray-300">{title}</h2>
            
            <button 
              onClick={toggleSortOrder}
              className="text-gray-950 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full flex items-center justify-center"
            >
              {sortOrder === 'asc' ? (
                <PiSortDescendingLight size={24} />
              ) : (
                <PiSortAscendingLight size={24} />
              )}
            </button>
  
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>
          
          <div className='px-1 flex-1 min-h-[300px] max-h-[500px] overflow-y-auto'>
            <div className="grid md:grid-cols-2 md:gap-4">
            {sortedTasks.map((task) => (
  <TaskCard
    key={task.id}
    task={task}
    onCardClick={() => handleCardClick(task)} 
    onMobileMove={onDrop} 
  />
))}
            </div>
          </div>
        </div>
  
        <TaskForm 
          isOpen={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onSubmit={handleAddTask}
        />
  
        <TaskDetailModal
          isOpen={showTaskDetail}
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </>
    );
  };

export default TaskColumn;