import { useState } from 'react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useTasks } from '../context/TaskContext';
const columns = [
  { id: 'Pending', label: 'Pending', icon: '⏳', color: 'border-yellow-500/40', badge: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'In Progress', label: 'In Progress', icon: '⚙️', color: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400' },
  { id: 'Completed', label: 'Completed', icon: '✅', color: 'border-green-500/40', badge: 'bg-green-500/20 text-green-400' },
];
const Kanban = () => {
  const { tasks, loading } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const openCreate = () => { setEditTask(null); setShowModal(true); };
  const openEdit = (task) => { setEditTask(task); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTask(null); };
  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track all manufacturing tasks</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Task
        </button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className={`bg-gray-900 border-t-2 ${col.color} rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{col.icon}</span>
                    <h2 className="text-white font-semibold text-sm">{col.label}</h2>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badge}`}>{colTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
                      <p className="text-gray-500 text-sm">No tasks here</p>
                    </div>
                  ) : (
                    colTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={openEdit} />)
                  )}
                </div>
                <button onClick={openCreate} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-300 text-xs border border-dashed border-gray-700 hover:border-gray-500 rounded-xl transition-colors">+ Add task</button>
              </div>
            );
          })}
        </div>
      )}
      {showModal && <TaskModal onClose={closeModal} editTask={editTask} />}
    </Layout>
  );
};
export default Kanban;
