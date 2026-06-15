import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import TaskModal from '../components/TaskModal';
import { useTasks } from '../context/TaskContext';

const priorityStyles = {
  High: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

const statusStyles = {
  Pending: 'bg-yellow-500/20 text-yellow-400',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  Completed: 'bg-green-500/20 text-green-400',
};

const statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];
const priorityOptions = ['All', 'High', 'Medium', 'Low'];

const Tasks = () => {
  const { tasks, loading, deleteTask, updateTask } = useTasks();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => {
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || [task.title, task.description, task.assignedTo].join(' ').toLowerCase().includes(query);
        const matchesStatus = status === 'All' || task.status === status;
        const matchesPriority = priority === 'All' || task.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tasks, search, status, priority]);

  const overdueCount = filteredTasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed').length;
  const dueSoonCount = filteredTasks.filter((task) => {
    if (!task.dueDate || task.status === 'Completed') return false;
    const diff = new Date(task.dueDate).getTime() - Date.now();
    return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const unassignedCount = filteredTasks.filter((task) => !task.assignedTo).length;

  const openCreate = () => {
    setEditTask(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
  };

  const quickMove = async (id, nextStatus) => {
    await updateTask(id, { status: nextStatus });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Center</h1>
          <p className="text-gray-400 text-sm mt-1">A richer operations workspace with search, filters, quick actions and list-based task management.</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 self-start lg:self-auto">
          <span className="text-lg leading-none">+</span> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Filtered Tasks" value={filteredTasks.length} icon="🧾" color="blue" subtitle="Current view result"/>
        <StatCard title="Due In 7 Days" value={dueSoonCount} icon="📆" color="purple" subtitle="Upcoming commitments"/>
        <StatCard title="Overdue" value={overdueCount} icon="🚨" color="red" subtitle="Need escalation"/>
        <StatCard title="Unassigned" value={unassignedCount} icon="👤" color="yellow" subtitle="Awaiting owner"/>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description or assignee"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500">
              {statusOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500">
              {priorityOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button onClick={() => { setSearch(''); setStatus('All'); setPriority('All'); }} className="px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors">Reset Filters</button>
          <span className="text-xs text-gray-500">Showing {filteredTasks.length} of {tasks.length} tasks</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-base">Operations List</h2>
            <p className="text-gray-500 text-sm mt-1">Review work orders with fast updates from a single list view.</p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-4xl mb-3">🔎</p>
            <p className="text-white text-sm font-medium">No tasks match the current filters.</p>
            <p className="text-gray-500 text-sm mt-1">Try resetting the filters or create a new task.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredTasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
              return (
                <div key={task._id} className="p-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between hover:bg-gray-800/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold text-sm truncate">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status] || ''}`}>{task.status}</span>
                      {isOverdue && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">Overdue</span>}
                    </div>
                    {task.description && <p className="text-gray-400 text-sm leading-6 max-w-3xl">{task.description}</p>}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Assignee: {task.assignedTo || 'Unassigned'}</span>
                      <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not scheduled'}</span>
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 xl:justify-end xl:max-w-sm">
                    {task.status !== 'Pending' && <button onClick={() => quickMove(task._id, 'Pending')} className="px-3 py-2 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors">Move to Pending</button>}
                    {task.status !== 'In Progress' && <button onClick={() => quickMove(task._id, 'In Progress')} className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">Move to In Progress</button>}
                    {task.status !== 'Completed' && <button onClick={() => quickMove(task._id, 'Completed')} className="px-3 py-2 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">Mark Completed</button>}
                    <button onClick={() => openEdit(task)} className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(task._id)} className="px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && <TaskModal onClose={closeModal} editTask={editTask} />}
    </Layout>
  );
};

export default Tasks;
