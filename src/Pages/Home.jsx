import React, { useState, useEffect } from 'react';
import { Sun, Moon, X, Plus, ListTodo, Clock4, CheckCircle2, } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};


const TaskForm = ({ onSubmit, initialData = null, isOpen, onClose }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  
    useEffect(() => {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        setDueDate(initialData.dueDate || '');
      } else {
        setTitle('');
        setDescription('');
        setDueDate('');
      }
    }, [initialData, isOpen]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ title, description, dueDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add New Task"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              maxLength={50}
              required
              className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              maxLength={200}
              className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {initialData ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      </Modal>
    );
  };

const TaskCounter = ({ tasks }) => {
  const getCount = (category) => tasks[category].length;
  
  const CounterCard = ({ title, count, icon: Icon, color }) => (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className={`${color} rounded-full p-2 mb-2`}>
        <Icon size={24} className="text-white" />
      </div>
      <h2 className={`font-bold text-lg ${color} mb-1`}>{title}</h2>
      <p className="text-3xl font-bold dark:text-white">{count}</p>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
      <h1 className="text-center mb-6 text-2xl dark:text-gray-300 font-bold">Task Counter</h1>
      <div className="grid grid-cols-3 gap-4">
        <CounterCard 
          title="To-Do" 
          count={getCount('To-Do')} 
          icon={ListTodo}
          color="bg-blue-500"
        />
        <CounterCard 
          title="In Progress" 
          count={getCount('In Progress')} 
          icon={Clock4}
          color="bg-yellow-500"
        />
        <CounterCard 
          title="Done" 
          count={getCount('Done')} 
          icon={CheckCircle2}
          color="bg-green-500"
        />
      </div>
    </div>
  );
};



const MobileTaskMoveModal = ({ isOpen, onClose, onMove, task }) => {
    if (!isOpen) return null;
  
    const categories = ['To-Do', 'In Progress', 'Done'];
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Move Task</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onMove(task.id, category);
                  onClose();
                }}
                className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 
                  hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };


// New
  const TaskDetailModal = ({ isOpen, onClose, task, onEdit, onDelete }) => {
    if (!isOpen) return null;
  
    const handleDelete = () => {
      onDelete(task.id);
      onClose();
    };
  
    const handleEdit = () => {
      onEdit(task);
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold dark:text-white">{task.title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                <p className="text-gray-900 dark:text-gray-100 mt-1">{task.description}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
              <p className="text-gray-900 dark:text-gray-100">{task.category}</p>
            </div>
            
            {task.dueDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</h4>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h4>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(task.timestamp).toLocaleDateString()}
              </p>
            </div>
  
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
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
          <div>
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

  import { PiSortAscendingLight, PiSortDescendingLight } from "react-icons/pi";

  
  const TaskColumn = ({ title, tasks, onDrop, onEdit, onDelete, onMobileMove, onAddTask }) => {
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
    onCardClick={() => handleCardClick(task)} // This will open TaskDetailModal
    onMobileMove={onDrop} // For mobile drag and drop functionality
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
  



  const Home = () => {
    const [tasks, setTasks] = useState(() => {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : {
        'To-Do': [],
        'Progress': [],
        'Done': []
      };
    });
    
    const [darkMode, setDarkMode] = useState(false);
    const [activityLog, setActivityLog] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
  
    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);
  
    const addTask = (taskData) => {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        timestamp: new Date().toISOString()
      };
      
      setTasks(prev => ({
        ...prev,
        [taskData.category]: [...prev[taskData.category], newTask]
      }));
      
      logActivity(`New task "${taskData.title}" created in ${taskData.category}`);
    };
  
    const moveTask = (taskId, targetCategory) => {
      let task;
      let sourceCategory;
      
      const newTasks = { ...tasks };
      
      Object.entries(tasks).forEach(([category, categoryTasks]) => {
        const taskIndex = categoryTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          task = categoryTasks[taskIndex];
          sourceCategory = category;
          newTasks[category] = categoryTasks.filter(t => t.id !== taskId);
        }
      });
      
      if (task && sourceCategory !== targetCategory) {
        task.category = targetCategory;
        newTasks[targetCategory] = [...newTasks[targetCategory], task];
        setTasks(newTasks);
        logActivity(`Task "${task.title}" moved from ${sourceCategory} to ${targetCategory}`);
      }
    };
  
    const handleEdit = (task) => {
      setEditingTask(task);
      setShowEditModal(true);
    };
  
    const handleDelete = (taskId) => {
      const newTasks = { ...tasks };
      Object.keys(newTasks).forEach(category => {
        const taskIndex = newTasks[category].findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const task = newTasks[category][taskIndex];
          newTasks[category] = newTasks[category].filter(t => t.id !== taskId);
          logActivity(`Task "${task.title}" deleted`);
        }
      });
      setTasks(newTasks);
    };
  
    const updateTask = (taskData) => {
      const newTasks = { ...tasks };
      Object.keys(newTasks).forEach(category => {
        const taskIndex = newTasks[category].findIndex(t => t.id === editingTask.id);
        if (taskIndex !== -1) {
          newTasks[category][taskIndex] = {
            ...editingTask,
            ...taskData,
            category: editingTask.category
          };
          logActivity(`Task "${taskData.title}" updated`);
        }
      });
      setTasks(newTasks);
      setEditingTask(null);
      setShowEditModal(false);
    };
  
    const logActivity = (message) => {
      setActivityLog(prev => [...prev, {
        message,
        timestamp: new Date().toISOString()
      }]);
    };
  
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 p-1">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DoneZo</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="text-white" /> : <Moon className="text-gray-900" />}
            </button>
          </div>
  
          <TaskCounter tasks={tasks} />
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(tasks).map(([category, categoryTasks]) => (
              <TaskColumn
                key={category}
                title={category}
                tasks={categoryTasks}
                onDrop={moveTask}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMobileMove={moveTask}
                onAddTask={addTask}
              />
            ))}
          </div>
  
          {editingTask && (
            <TaskForm
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingTask(null);
              }}
              onSubmit={updateTask}
              initialData={editingTask}
            />
          )}
  
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="font-bold mb-4 text-gray-700 dark:text-gray-300">Activity Log</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activityLog.slice(-10).reverse().map((activity, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleTimeString()}: {activity.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Home;