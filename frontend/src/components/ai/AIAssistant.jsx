import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Plus, CheckCircle, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../features/taskSlice';
import { chatWithAI } from '../../services/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hi! I'm your AI Assistant. I can help you brainstorm, write emails, or break down your projects into tasks. What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const result = await chatWithAI(userText, messages);
      
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          role: 'ai', 
          content: result.message,
          type: result.type,
          tasks: result.tasks,
          addedTasks: false
        }
      ]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: "Oops! Something went wrong. " + error.message }]);
      toast.error('AI Service Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleAddTasks = (messageId, tasks) => {
    if (!tasks) return;
    tasks.forEach(task => {
      dispatch(createTask(task));
    });
    
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, addedTasks: true } : msg));
    toast.success('Tasks added to your board!');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  const quickPrompts = [
    "Plan my day",
    "Draft a project update email",
    "I need to prep for a meeting"
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-tr from-[var(--color-primary)] to-purple-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative group"
            >
              <Sparkles className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[var(--bg-color)] animate-pulse"></div>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] glass bg-[var(--surface-base)]/95 border border-[var(--border-subtle)] rounded-2xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
              style={{ maxHeight: '700px', height: '85vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-primary)]/10 to-purple-500/10 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-color)] text-sm">Taskify AI</h3>
                    <p className="text-[10px] text-[var(--color-primary)] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 bg-[var(--surface-hover)] rounded-full">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-[var(--surface-hover)]">
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {quickPrompts.map((prompt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-primary)]/30 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-[var(--color-primary)] text-white rounded-br-sm shadow-md' 
                        : 'bg-[var(--surface-base)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-bl-sm shadow-md'
                    }`}>
                      {msg.role === 'ai' ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                      
                      {/* Parsed Tasks Preview */}
                      {msg.type === 'tasks' && msg.tasks && !msg.addedTasks && (
                        <div className="mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-3">
                          <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Suggested Plan</div>
                          {msg.tasks.map((task, idx) => (
                            <div key={idx} className="bg-[var(--surface-active)] border border-[var(--border-subtle)] p-2.5 rounded-lg text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-[var(--text-primary)]">{task.title}</span>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--surface-hover)] ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleAddTasks(msg.id, msg.tasks)}
                            className="w-full mt-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-lg text-xs font-bold flex justify-center items-center gap-2 shadow-lg transition-all"
                          >
                            <Plus className="w-3.5 h-3.5"/> Add All to Board
                          </button>
                        </div>
                      )}
                      
                      {msg.addedTasks && (
                        <div className="mt-3 pt-2 border-t border-gray-700 flex items-center gap-1.5 text-xs text-green-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Added to your tasks
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[var(--surface-base)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center shadow-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-base)]">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-full pl-4 pr-12 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors shadow-md"
                  >
                    <Send className="w-4 h-4 -ml-0.5 mt-0.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AIAssistant;
