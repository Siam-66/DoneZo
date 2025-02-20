import React, { useState, useEffect } from 'react';
import { Camera, Sun, Moon } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, provided }) => {
  const dueDateColor = task.dueDate && new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500';
  
  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3 cursor-move"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
          )}
          {task.dueDate && (
            <p className={`text-xs mt-2 ${dueDateColor}`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Created: {new Date(task.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, onDrop }) => {
  return (
    <div 
      className="bg-gray-200 border-2 border-gray-200 dark:bg-gray-900 p-4 rounded-lg flex-1 min-h-[500px] max-w-sm"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        onDrop(taskId, title);
      }}
    >
      <h2 className="font-bold mb-4 text-gray-700 dark:text-gray-300">{title}</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task.id);
            }}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskForm = ({ onSubmit, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate });
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <div className='flex justify-between'>
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 w-1/2">
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
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {initialData ? 'Update Task' : 'Add Task'}
      </button>
    </form>
    <div>
        <h1>
            adada
        </h1>
    </div>
    </div>

  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : {
      'To-Do': [],
      'In Progress': [],
      'Done': []
    };
  });
  
  const [darkMode, setDarkMode] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

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
      timestamp: new Date().toISOString(),
    };
    
    setTasks(prev => ({
      ...prev,
      'To-Do': [...prev['To-Do'], newTask]
    }));
    
    logActivity(`New task "${taskData.title}" created`);
  };

  const moveTask = (taskId, targetCategory) => {
    let task;
    let sourceCategory;
    
    const newTasks = { ...tasks };
    
    // Find the task and its category
    Object.entries(tasks).forEach(([category, categoryTasks]) => {
      const taskIndex = categoryTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        task = categoryTasks[taskIndex];
        sourceCategory = category;
        newTasks[category] = categoryTasks.filter(t => t.id !== taskId);
      }
    });
    
    if (task && sourceCategory !== targetCategory) {
      newTasks[targetCategory] = [...newTasks[targetCategory], task];
      setTasks(newTasks);
      logActivity(`Task "${task.title}" moved from ${sourceCategory} to ${targetCategory}`);
    }
  };

  const deleteTask = (taskId) => {
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
        };
        logActivity(`Task "${taskData.title}" updated`);
      }
    });
    setTasks(newTasks);
    setEditingTask(null);
  };

  const logActivity = (message) => {
    setActivityLog(prev => [...prev, {
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DoneZo</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="text-white" /> : <Moon className="text-gray-900" />}
          </button>
        </div>

        <TaskForm onSubmit={editingTask ? updateTask : addTask} initialData={editingTask} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(tasks).map(([category, categoryTasks]) => (
            <TaskColumn
              key={category}
              title={category}
              tasks={categoryTasks}
              onDrop={moveTask}
            />
          ))}
        </div>

        <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="font-bold mb-4 text-gray-700 dark:text-gray-300">Activity Log</h2>
          <div className="space-y-2">
            {activityLog.slice(-5).reverse().map((activity, index) => (
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

export default TaskManager;