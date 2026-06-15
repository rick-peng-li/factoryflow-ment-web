import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import Schedule from './pages/Schedule';
import Team from './pages/Team';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>}/>
            <Route path="/kanban" element={<ProtectedRoute><Kanban /></ProtectedRoute>}/>
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>}/>
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>}/>
            <Route path="/" element={<Navigate to="/dashboard" replace />}/>
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
