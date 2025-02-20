import { X } from 'lucide-react';

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

export default MobileTaskMoveModal;