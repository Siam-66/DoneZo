import { ListTodo, Clock4, CheckCircle2 } from 'lucide-react';

const TaskCounter = ({ tasks }) => {
  const getCount = (category) => 
    tasks[category]?.filter(t => t.category === category).length || 0;

  const CounterCard = ({ title, count, icon: Icon, color }) => (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 mb-5 rounded-lg shadow-md">
      <div className={`${color} rounded-full p-2 mb-2`}>
        <Icon size={24} className="text-white" />
      </div>
      <h2 className={`font-bold md:text-lg text-sm rounded-xl px-2 py-1 ${color} mb-1`}>{title}</h2>
      <p className="md:text-3xl text-xl font-bold dark:text-white">{count}</p>
    </div>
  );

  return (
<div className="bg-gray-100 dark:bg-gray-900 p-5 mb-5 rounded-lg">
      <h1 className="text-center mb-6 text-2xl dark:text-gray-300 font-bold">Task Counter</h1>
      <div className="grid grid-cols-3 gap-4">
        <CounterCard 
          title="To-Do" 
          count={getCount('To-Do')} 
          icon={ListTodo}
          color="bg-sky-400"
        /> 
        <CounterCard 
          title="Progress" 
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

export default TaskCounter;