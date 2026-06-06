import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/authSlice';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Workspace from './pages/Workspace';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import PageTransition from './components/common/PageTransition';

import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTasks from './pages/admin/AdminTasks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/tasks" element={<PageTransition><Tasks /></PageTransition>} />
        <Route path="/calendar" element={<PageTransition><Calendar /></PageTransition>} />
        <Route path="/workspace" element={<PageTransition><Workspace /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><PageTransition><AdminUsers /></PageTransition></AdminRoute>} />
        <Route path="/admin/tasks" element={<AdminRoute><PageTransition><AdminTasks /></PageTransition></AdminRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
        }} 
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <AnimatedRoutes />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App;
