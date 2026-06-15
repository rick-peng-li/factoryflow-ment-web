import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useTasks } from '../context/TaskContext';

const priorityStyles = {
  High: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

const Team = () => {
  const { tasks, loading } = useTasks();

  const members = useMemo(() => {
    const grouped = tasks.reduce((acc, task) => {
      const key = task.assignedTo || 'Unassigned';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          total: 0,
          completed: 0,
          active: 0,
          pending: 0,
          highPriority: 0,
          tasks: [],
        };
      }
      acc[key].total += 1;
      acc[key].tasks.push(task);
      if (task.status === 'Completed') acc[key].completed += 1;
      if (task.status === 'In Progress') acc[key].active += 1;
      if (task.status === 'Pending') acc[key].pending += 1;
      if (task.priority === 'High') acc[key].highPriority += 1;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => {
      if (b.active !== a.active) return b.active - a.active;
      if (b.highPriority !== a.highPriority) return b.highPriority - a.highPriority;
      return b.total - a.total;
    });
  }, [tasks]);

  const [selectedMember, setSelectedMember] = useState('All');

  const selectedTasks = useMemo(() => {
    if (selectedMember === 'All') {
      return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return members.find((member) => member.name === selectedMember)?.tasks || [];
  }, [selectedMember, tasks, members]);

  const activeMembers = members.filter((member) => member.name !== 'Unassigned').length;
  const busiestMember = members[0]?.name || 'N/A';
  const unassigned = members.find((member) => member.name === 'Unassigned');
  const overallCompletion = tasks.length > 0 ? Math.round((tasks.filter((task) => task.status === 'Completed').length / tasks.length) * 100) : 0;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Team Workload</h1>
        <p className="text-gray-400 text-sm mt-1">Inspect assignee capacity, high-priority ownership and workload balance across the factory team.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Members" value={activeMembers} icon="👥" color="blue" subtitle="Named assignees with tasks"/>
        <StatCard title="Busiest Owner" value={busiestMember} icon="🏁" color="purple" subtitle="Highest active load"/>
        <StatCard title="Unassigned" value={unassigned?.total || 0} icon="📭" color="yellow" subtitle="Tasks missing ownership"/>
        <StatCard title="Completion Rate" value={`${overallCompletion}%`} icon="📈" color="green" subtitle="Across all tasks"/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-base">Assignee Capacity Board</h2>
              <p className="text-gray-500 text-sm mt-1">Click a card to inspect the owner-specific task list.</p>
            </div>
            <button onClick={() => setSelectedMember('All')} className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors">Show All</button>
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading team view...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">No assignee data yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => {
                const openCount = member.total - member.completed;
                const selected = selectedMember === member.name;
                return (
                  <button
                    key={member.name}
                    onClick={() => setSelectedMember(member.name)}
                    className={`text-left rounded-2xl p-5 border transition-colors ${selected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-gray-800/50 hover:border-gray-600'}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-sm">{member.name}</h3>
                        <p className="text-gray-500 text-xs mt-1">{openCount} open • {member.completed} completed</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-lg">{member.name === 'Unassigned' ? '📭' : '👤'}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center mb-4">
                      <div>
                        <p className="text-blue-400 font-bold text-lg">{member.active}</p>
                        <p className="text-gray-500 text-[11px]">In Progress</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold text-lg">{member.pending}</p>
                        <p className="text-gray-500 text-[11px]">Pending</p>
                      </div>
                      <div>
                        <p className="text-red-400 font-bold text-lg">{member.highPriority}</p>
                        <p className="text-gray-500 text-[11px]">High</p>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${member.total > 0 ? Math.max(12, Math.round((openCount / member.total) * 100)) : 0}%` }}/>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-white font-semibold text-base">Team Notes</h2>
            <p className="text-gray-500 text-sm mt-1">Operational indicators derived from current task ownership.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Primary bottleneck</p>
              <p className="text-white text-sm font-semibold">{busiestMember}</p>
              <p className="text-gray-400 text-xs mt-2">This owner currently carries the heaviest active queue.</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Ownership gap</p>
              <p className="text-white text-sm font-semibold">{unassigned?.total || 0} tasks without assignee</p>
              <p className="text-gray-400 text-xs mt-2">Assign these items to reduce hidden queue risk.</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">High-priority concentration</p>
              <p className="text-white text-sm font-semibold">{members.reduce((sum, member) => sum + member.highPriority, 0)} urgent tasks across team</p>
              <p className="text-gray-400 text-xs mt-2">Use this view to rebalance who owns the most critical work.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold text-base">{selectedMember === 'All' ? 'All Tasks' : `${selectedMember} Tasks`}</h2>
            <p className="text-gray-500 text-sm mt-1">Detailed task list for the selected workload bucket.</p>
          </div>
          <p className="text-xs text-gray-500">{selectedTasks.length} tasks in this view</p>
        </div>
        {selectedTasks.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">No tasks in this selection.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedTasks.map((task) => (
              <div key={task._id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{task.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{task.status} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Low}`}>{task.priority}</span>
                </div>
                {task.description && <p className="text-gray-400 text-sm mt-3 leading-6">{task.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Team;
