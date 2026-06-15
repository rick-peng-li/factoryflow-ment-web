import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) navigate('/dashboard');
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white text-2xl">🏭</span>
          </div>
          <h1 className="text-3xl font-bold text-white">FactoryFlow</h1>
          <p className="text-gray-400 mt-1">Sign in to your workspace</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@factory.com" required className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Your password" required className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Login;
