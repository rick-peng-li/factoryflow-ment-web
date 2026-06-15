import { useMemo } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useTasks } from '../context/TaskContext';

const priorityStyles = {
  High: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const isSameDay = (first, second) => startOfDay(first).getTime() === startOfDay(second).getTime();

const Schedule = () => {
  const { tasks, loading } = useTasks();

  const today = startOfDay(new Date());
  const datedTasks = useMemo(
    () => [...tasks].filter((task) => task.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [tasks]
  );

  const overdueTasks = datedTasks.filter((task) => startOfDay(task.dueDate) < today && task.status !== 'Completed');
  const todayTasks = datedTasks.filter((task) => isSameDay(task.dueDate, today));
  const thisWeekTasks = datedTasks.filter((task) => {
    const diffDays = Math.ceil((startOfDay(task.dueDate).getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return diffDays >= 0 && diffDays <= 6;
  });
  const unscheduledTasks = tasks.filter((task) => !task.dueDate && task.status !== 'Completed');

  const timelineDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const items = datedTasks.filter((task) => isSameDay(task.dueDate, date));
    return {
      key: date.toISOString(),
      label: date.toLocaleDateString([], { weekday: 'short' }),
      dateLabel: date.toLocaleDateString(),
      items,
    };
  });

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Schedule View</h1>
        <p className="text-gray-400 text-sm mt-1">Plan the week, monitor due dates and surface work that needs immediate scheduling attention.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Overdue" value={overdueTasks.length} icon="🚨" color="red" subtitle="Behind planned date"/>
        <StatCard title="Due Today" value={todayTasks.length} icon="📌" color="yellow" subtitle="Must be reviewed today"/>
        <StatCard title="This Week" value={thisWeekTasks.length} icon="🗓️" color="blue" subtitle="Next 7-day plan"/>
        <StatCard title="Unscheduled" value={unscheduledTasks.length} icon="🧠" color="purple" subtitle="Needs date assignment"/>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="mb-5">
          <h2 className="text-white font-semibold text-base">7-Day Timeline</h2>
          <p className="text-gray-500 text-sm mt-1">A lightweight calendar strip for the production week.</p>
        </div>
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading schedule...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {timelineDays.map((day) => (
              <div key={day.key} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4 min-h-[220px] flex flex-col">
                <div className="mb-4">
                  <p className="text-white font-semibold text-sm">{day.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{day.dateLabel}</p>
                </div>
                <div className="space-y-3 flex-1">
                  {day.items.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-gray-700 rounded-xl text-gray-500 text-xs text-center px-2">No scheduled work</div>
                  ) : (
                    day.items.map((task) => (
                      <div key={task._id} className="bg-gray-900 border border-gray-700 rounded-xl p-3">
                        <p className="text-white text-xs font-semibold leading-5">{task.title}</p>
                        <p className="text-gray-500 text-xs mt-1">{task.assignedTo || 'Unassigned'}</p>
                        <span className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">Urgent Schedule Queue</h2>
            <p className="text-gray-500 text-sm mt-1">Overdue and due-today tasks sorted by urgency.</p>
          </div>
          {[...overdueTasks, ...todayTasks.filter((task) => !overdueTasks.some((item) => item._id === task._id))].length === 0 ? (
            <div className="text-center py-14 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">No urgent scheduled work right now.</div>
          ) : (
            <div className="space-y-3">
              {[...overdueTasks, ...todayTasks.filter((task) => !overdueTasks.some((item) => item._id === task._id))].map((task) => {
                const overdue = startOfDay(task.dueDate) < today && task.status !== 'Completed';
                return (
                  <div key={task._id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-white text-sm font-semibold">{task.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${overdue ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{overdue ? 'Overdue' : 'Due Today'}</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{task.assignedTo || 'Unassigned'} • due {new Date(task.dueDate).toLocaleDateString()} • {task.status}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">Backlog Without Date</h2>
            <p className="text-gray-500 text-sm mt-1">Tasks that still need to be placed on the calendar.</p>
          </div>
          {unscheduledTasks.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">Every open task has a planned date.</div>
          ) : (
            <div className="space-y-3">
              {unscheduledTasks.slice(0, 6).map((task) => (
                <div key={task._id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white text-sm font-semibold">{task.title}</p>
                      <p className="text-gray-500 text-xs mt-1">{task.assignedTo || 'Unassigned'} • {task.status}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                  </div>
                </div>
              ))}
              {unscheduledTasks.length > 6 && <p className="text-gray-500 text-xs">+ {unscheduledTasks.length - 6} more unscheduled tasks</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
