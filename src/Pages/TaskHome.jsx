import { useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import TaskCounter from '../components/TaskCounter';
import TaskColumn from '../components/TaskColumn';
import TaskForm from '../components/TaskForm';
import { AuthContext } from "../Provider/AuthProvider";

  const TaskHome = () => {
    const { user, logOut } = useContext(AuthContext);
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

            <div className="flex items-center  rounded-3xl">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="text-white size-8" /> : <Moon className="text-gray-900 size-8" />}
            </button>

{user?.email ? (

<div className="dropdown dropdown-end">
{/* Dropdown button */}
<button
tabIndex={0}
className="btn btn-ghost btn-circle mr-2 avatar"
aria-label="Open user menu"
>
<div className="w-10 rounded-full">
<img
className="w-12 h-12 rounded-full border-2 border-green-700"
alt={user?.displayName}
src={user?.photoURL}

/>
</div>
</button>

{/* Dropdown menu */}
<ul
tabIndex={0}
className="menu menu-sm dropdown-content bg-base-100 dark:bg-gray-900 rounded-box z-[1] mt-3 w-56 p-2 pr-3 shadow dropdown-start">
<li className="bg-gradient-to-r from-green-600 to-lime-500 text-white rounded-lg mb-1 py-4">
<p>{user?.displayName}</p>
<p className="text-xs">{user?.email}</p>
</li>
<li className="w-28 mt-3 ml-10">
<button
onClick={logOut}
className="px-4 py-2 text-center dark:text-gray-200 rounded-3xl md:text-lg text-sm font-semibold border-lime-500 hover:bg-gradient-to-r from-green-600 to-lime-500 text-black hover:text-white border"
>
Log Out
</button>
</li>
</ul>
</div>



  ) : 
  
  (
    
    <div className="flex items-center ">
    <NavLink
      to="login"
      className="px-5 py-2  rounded-3xl md:text-xl text-xs font-semibold bg-gradient-to-r from-green-600 to-lime-500 border text-white"
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