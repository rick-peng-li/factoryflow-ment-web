import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
const TaskModal = ({ onClose, editTask = null }) => {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending', priority: 'Medium', assignedTo: '', dueDate: '' });
  useEffect(() => {
    if (editTask) setForm({ title: editTask.title || '', description: editTask.description || '', status: editTask.status || 'Pending', priority: editTask.priority || 'Medium', assignedTo: editTask.assignedTo || '', dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '' });
  }, [editTask]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = editTask ? await updateTask(editTask._id, form) : await createTask(form);
    setLoading(false);
    if (success) onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">{editTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Weld Frame Section A" required className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional details..." rows={3} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                <option>Pending</option><option>In Progress</option><option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Assign To</label>
              <input type="text" name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="Employee name" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"/>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg py-2.5 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors">{loading ? 'Saving...' : editTask ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskModal;
