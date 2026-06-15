import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/tasks', label: 'Task Center' },
  { path: '/kanban', label: 'Kanban' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/team', label: 'Team' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8 min-w-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-base">🏭</div>
            <span className="text-white font-bold text-lg">FactoryFlow</span>
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive(item.path) ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{user?.role}</span>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="min-w-0">
              <p className="text-gray-200 text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="ml-2 text-gray-400 hover:text-red-400 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
