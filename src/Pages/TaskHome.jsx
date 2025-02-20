import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import TaskCounter from '../components/TaskCounter';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';

  const TaskHome = () => {
    const [tasks, setTasks] = useState(() => {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : {
        'To-Do': [],
        'In Progress': [], // Make sure this matches exactly
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

export default TaskHome;