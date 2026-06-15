import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

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

const quickLinks = [
  { to: '/tasks', title: 'Task Center', description: 'Search, filter and update every task in one place.', icon: '🧾' },
  { to: '/kanban', title: 'Kanban Board', description: 'Track production flow by status lanes.', icon: '🗂️' },
  { to: '/schedule', title: 'Schedule', description: 'Review deadlines, overdue work and weekly plan.', icon: '📆' },
  { to: '/team', title: 'Team', description: 'Balance workload and inspect assignee capacity.', icon: '👥' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading } = useTasks();

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const upcomingTasks = [...tasks]
    .filter((task) => task.dueDate && task.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);
  const workload = Object.entries(
    tasks.reduce((acc, task) => {
      const key = task.assignedTo || 'Unassigned';
      acc[key] = (acc[key] || 0) + (task.status === 'Completed' ? 0 : 1);
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const overdueCount = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed').length;

  return (
    <Layout>
      <div className="flex flex-col gap-6 mb-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good day, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1 text-sm max-w-2xl">FactoryFlow now includes a dashboard, task center, kanban, schedule and team workload views to support daily planning and shop-floor collaboration.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 hover:border-blue-500/40 transition-colors">
              <p className="text-xl mb-2">{item.icon}</p>
              <p className="text-white text-sm font-semibold">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tasks" value={stats.total} icon="📋" color="blue" subtitle="All tracked work"/>
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="yellow" subtitle="Waiting to start"/>
        <StatCard title="In Progress" value={stats.inProgress} icon="⚙️" color="purple" subtitle="Currently active"/>
        <StatCard title="Completed" value={stats.completed} icon="✅" color="green" subtitle="Finished items"/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-base">Recent Tasks</h2>
              <p className="text-gray-500 text-sm mt-1">Latest activity across production planning and execution.</p>
            </div>
            <Link to="/tasks" className="text-blue-400 hover:text-blue-300 text-sm font-medium">Open task center →</Link>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading tasks...</div>
          ) : recentTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 text-sm">No tasks yet.</p>
              <Link to="/kanban" className="mt-3 inline-block text-blue-400 text-sm">Create your first task →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{task.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{task.assignedTo || 'Unassigned'} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status] || ''}`}>{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold text-base mb-4">Overall Progress</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Completion rate</span>
              <span className="text-white font-bold text-sm">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}/>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-yellow-400 font-bold text-lg">{stats.pending}</p><p className="text-gray-500 text-xs">Pending</p></div>
              <div><p className="text-blue-400 font-bold text-lg">{stats.inProgress}</p><p className="text-gray-500 text-xs">Active</p></div>
              <div><p className="text-green-400 font-bold text-lg">{stats.completed}</p><p className="text-gray-500 text-xs">Done</p></div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔴</span>
              <h3 className="text-white font-semibold text-sm">Urgent Focus</h3>
            </div>
            <p className="text-red-400 text-3xl font-bold mt-1">{overdueCount}</p>
            <p className="text-gray-400 text-xs mt-1">overdue tasks need attention from the floor team</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-base">Upcoming Deadlines</h2>
              <p className="text-gray-500 text-sm mt-1">The next due tasks that still need to be closed.</p>
            </div>
            <Link to="/schedule" className="text-blue-400 hover:text-blue-300 text-sm font-medium">View schedule →</Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">No upcoming deadlines right now.</div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between gap-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{task.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{task.assignedTo || 'Unassigned'} • due {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-base">Team Snapshot</h2>
              <p className="text-gray-500 text-sm mt-1">Open workload grouped by assignee.</p>
            </div>
            <Link to="/team" className="text-blue-400 hover:text-blue-300 text-sm font-medium">Open team view →</Link>
          </div>
          {workload.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">No team workload yet.</div>
          ) : (
            <div className="space-y-4">
              {workload.map(([name, count]) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white truncate">{name}</p>
                    <span className="text-xs text-gray-400">{count} open tasks</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(12, Math.min(100, count * 20))}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {quickLinks.map((item) => (
          <Link key={item.to} to={item.to} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-blue-500/40 transition-colors">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-gray-500 text-xs leading-5">{item.description}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
