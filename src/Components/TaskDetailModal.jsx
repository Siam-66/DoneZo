import { X } from 'lucide-react';

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
              <p className="text-gray-900 dark:text-gray-100 mt-1 break-words overflow-auto max-h-60">
                {task.description}
              </p>
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

export default TaskDetailModal;
