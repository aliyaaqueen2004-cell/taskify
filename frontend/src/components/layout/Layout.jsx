import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AIAssistant from '../ai/AIAssistant';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden transition-colors duration-300 relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background ambient light */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>
        
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent z-10 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Layout;
