import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
const TaskContext = createContext();
export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => { if (user) fetchTasks(); }, [user]);
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally { setLoading(false); }
  };
  const createTask = async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [data, ...prev]); return true;
    } catch (err) { setError(err.response?.data?.message || 'Failed to create task'); return false; }
  };
  const updateTask = async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t))); return true;
    } catch (err) { setError(err.response?.data?.message || 'Failed to update task'); return false; }
  };
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id)); return true;
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete task'); return false; }
  };
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    highPriority: tasks.filter((t) => t.priority === 'High').length,
  };
  return (
    <TaskContext.Provider value={{ tasks, loading, error, stats, fetchTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
export const useTasks = () => useContext(TaskContext);
