import { useState, useEffect } from 'react';
import Modal from './Modal';

const TaskForm = ({ onSubmit, initialData = null, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit({
        ...(initialData?.id && { id: initialData.id }),
        ...formData,
        ...(initialData?.category && { category: initialData.category })
      });
      
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
      onClose();
    } catch (error) {
      setError('Failed to save task. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Edit Task" : "Add New Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title*
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            maxLength={50}
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            maxLength={200}
            rows={3}
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100
              dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {initialData ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;