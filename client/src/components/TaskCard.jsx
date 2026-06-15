import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
const priorityStyles = { High: 'bg-red-500/20 text-red-400 border border-red-500/30', Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', Low: 'bg-green-500/20 text-green-400 border border-green-500/30' };
const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTasks();
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await deleteTask(task._id);
  };
  const moveTask = async (newStatus) => { await updateTask(task._id, { status: newStatus }); };
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(task)} className="text-gray-500 hover:text-blue-400 text-xs px-1.5 py-1 rounded transition-colors">✏️</button>
          <button onClick={handleDelete} disabled={deleting} className="text-gray-500 hover:text-red-400 text-xs px-1.5 py-1 rounded transition-colors">🗑️</button>
        </div>
      </div>
      <p className="text-white text-sm font-medium mb-1 leading-snug">{task.title}</p>
      {task.description && <p className="text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</p>}
      <div className="space-y-1 mb-3">
        {task.assignedTo && <div className="flex items-center gap-1.5"><span className="text-gray-500 text-xs">👤</span><span className="text-gray-400 text-xs">{task.assignedTo}</span></div>}
        {task.dueDate && <div className="flex items-center gap-1.5"><span className="text-gray-500 text-xs">📅</span><span className={`text-xs ${isOverdue ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{new Date(task.dueDate).toLocaleDateString()}{isOverdue && ' — Overdue'}</span></div>}
      </div>
      <div className="flex gap-1.5 pt-2 border-t border-gray-700">
        {task.status !== 'Pending' && <button onClick={() => moveTask('Pending')} className="flex-1 text-xs py-1 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors">← Pending</button>}
        {task.status !== 'In Progress' && <button onClick={() => moveTask('In Progress')} className="flex-1 text-xs py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">{task.status === 'Pending' ? 'Start →' : '← In Progress'}</button>}
        {task.status !== 'Completed' && <button onClick={() => moveTask('Completed')} className="flex-1 text-xs py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">Done ✓</button>}
      </div>
    </div>
  );
};
export default TaskCard;
