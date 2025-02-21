// TaskHome.jsx
import { useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import TaskCounter from '../components/TaskCounter';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';
import { AuthContext } from "../Provider/AuthProvider";
import donezo1 from "../../public/Donezo.png";

const TaskHome = () => {
  const { user, logOut } = useContext(AuthContext);
  const [tasks, setTasks] = useState({
    'To-Do': [],
    'In Progress': [],
    'Done': []
  });
  const [darkMode, setDarkMode] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch tasks when user logs in
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`https://donezo-server.vercel.app/tasks/${user.email}`);
        const data = await response.json();
        
        // Organize tasks by category
        const organizedTasks = {
          'To-Do': [],
          'In Progress': [],
          'Done': []
        };
        
        data.forEach(task => {
          if (organizedTasks[task.category]) {
            organizedTasks[task.category].push({
              ...task,
              id: task._id 
            });
          }
        });
        
        setTasks(organizedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [user?.email]);

  const logActivity = (message) => {
    setActivityLog(prev => [...prev, {
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch('https://donezo-server.vercel.app/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          email: user.email,
          timestamp: new Date().toISOString()
        })
      });
      
      const newTask = await response.json();
      
      setTasks(prev => ({
        ...prev,
        [taskData.category]: [...prev[taskData.category], {
          ...taskData,
          id: newTask._id,
          timestamp: newTask.timestamp
        }]
      }));
      
      logActivity(`Added new task: ${taskData.title}`);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskData) => {
    try {
      await fetch(`https://donezo-server.vercel.app/tasks/${taskData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      setTasks(prev => {
        const updatedTasks = { ...prev };
        const oldCategory = Object.keys(updatedTasks).find(category =>
          updatedTasks[category].some(task => task.id === taskData.id)
        );

        if (oldCategory) {
          updatedTasks[oldCategory] = updatedTasks[oldCategory].map(task =>
            task.id === taskData.id ? { ...task, ...taskData } : task
          );
        }

        return updatedTasks;
      });
      
      logActivity(`Updated task: ${taskData.title}`);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  

  const handleDelete = async (taskId) => {
    try {
      await fetch(`https://donezo-server.vercel.app/tasks/${taskId}`, {
        method: 'DELETE'
      });

      setTasks(prev => {
        const updatedTasks = { ...prev };
        Object.keys(updatedTasks).forEach(category => {
          const taskToDelete = updatedTasks[category].find(t => t.id === taskId);
          if (taskToDelete) {
            logActivity(`Deleted task: ${taskToDelete.title}`);
            updatedTasks[category] = updatedTasks[category].filter(t => t.id !== taskId);
          }
        });
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const moveTask = async (taskId, newCategory) => {
    try {
      await fetch(`https://donezo-server.vercel.app/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory })
      });

      setTasks(prev => {
        const updatedTasks = { ...prev };
        let movedTask;

        // Find and remove task from old category
        Object.keys(updatedTasks).forEach(category => {
          const taskIndex = updatedTasks[category].findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            movedTask = updatedTasks[category][taskIndex];
            updatedTasks[category] = updatedTasks[category].filter(t => t.id !== taskId);
          }
        });

        // Add task to new category
        if (movedTask) {
          updatedTasks[newCategory] = [
            ...updatedTasks[newCategory],
            { ...movedTask, category: newCategory }
          ];
          logActivity(`Moved task "${movedTask.title}" to ${newCategory}`);
        }

        return updatedTasks;
      });
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-1">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className='flex justify-center items-center'>
            <img className="w-12" src={donezo1} alt="DoneZo Logo" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DoneZo</h1>
          </div>

          <div className="flex items-center rounded-3xl">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="text-white size-8" /> : <Moon className="text-gray-900 size-8" />}
            </button>

            {user?.email ? (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-circle mr-2 avatar"
                  aria-label="Open user menu"
                >
                  <div className="w-10 rounded-full">
                    <img
                      className="w-12 h-12 rounded-full border-2 border-sky-500"
                      alt={user?.displayName}
                      src={user?.photoURL}
                    />
                  </div>
                </button>

                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 dark:bg-gray-900 rounded-box z-[1] mt-3 w-56 p-2 pr-3 shadow dropdown-start">
                  <li className="bg-sky-600  text-white rounded-lg mb-1 py-4">
                    <p>{user?.displayName}</p>
                    <p className="text-xs">{user?.email}</p>
                  </li>
                  <li className="w-28 mt-3 ml-10">
                    <button
                      onClick={logOut}
                      className="px-4 py-2 text-center dark:text-gray-200 rounded-3xl md:text-lg text-sm font-semibold border-sky-500 hover:bg-sky-500 text-black hover:text-white border"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center">
                <NavLink
                  to="login"
                  className="px-5 py-2 rounded-3xl md:text-xl text-xs font-semibold bg-sky-500 text-white"
                >
                  Log In
                </NavLink>
              </div>
            )}
          </div>
        </div>

        <TaskCounter tasks={tasks} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(tasks).map(([category, categoryTasks]) => (
            <TaskColumn
  key={category}
  title={category}
  tasks={categoryTasks}
  onDrop={moveTask}
  onEdit={(task) => {
    setEditingTask(task);
    setShowEditModal(true); // Add this line to open the edit modal
  }}
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