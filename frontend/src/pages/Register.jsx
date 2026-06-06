import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { register, clearError } from '../features/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-[#0f111a] text-black dark:text-white relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-20 animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-[#1e1f2b]/80 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl p-10 rounded-3xl w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join the AI Task Manager</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={onChange}
              className="w-full px-4 py-3 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-4 py-3 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={onChange}
              className="w-full px-4 py-3 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 dark:shadow-purple-600/30 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
