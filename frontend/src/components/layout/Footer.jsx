import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  MessageCircle, 
  Users, 
  Share2, 
  Hash, 
  Mail, 
  Send, 
  Heart,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast.success('Successfully subscribed to newsletter! 🎉');
    }, 1000);
  };

  const linkVariants = {
    hover: { x: 4, color: 'var(--color-primary)' }
  };

  const socialVariants = {
    hover: { y: -3, scale: 1.1, color: 'var(--color-primary)' }
  };

  return (
    <footer className="relative mt-20 pt-16 pb-8 border-t border-[var(--border-subtle)] bg-[var(--surface-base)]/50 backdrop-blur-xl overflow-hidden shrink-0">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-lg h-40 bg-[var(--color-primary)] blur-[100px] opacity-10 pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-primary)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-color)] tracking-tight">TaskFlow AI</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Organize tasks, boost productivity, and achieve more with AI-powered task management. The intelligent workspace for modern teams.
            </p>
            
            {/* Newsletter */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Subscribe to our newsletter</h3>
              <form onSubmit={handleSubscribe} className="relative max-w-sm flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-[var(--text-tertiary)]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl py-2.5 pl-10 pr-12 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--text-tertiary)]"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="absolute right-1.5 p-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[var(--text-color)] uppercase tracking-wider">Product</h3>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              {[
                { label: 'Home', path: '/home' },
                { label: 'Features', path: '/features' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Dashboard', path: '/' },
                { label: 'Task Management', path: '/tasks' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path}>
                    <motion.div whileHover="hover" variants={linkVariants} className="hover:text-[var(--color-primary)] transition-colors flex w-fit">
                      {link.label}
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[var(--text-color)] uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              {['AI Assistant', 'Team Collaboration', 'Analytics', 'Documentation', 'Help Center'].map((link) => (
                <li key={link}>
                  <motion.a href="#" whileHover="hover" variants={linkVariants} className="hover:text-[var(--color-primary)] transition-colors flex w-fit">
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[var(--text-color)] uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              {['About Us', 'Careers', 'Blog', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <motion.a href="#" whileHover="hover" variants={linkVariants} className="hover:text-[var(--color-primary)] transition-colors flex w-fit">
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <span>© 2026 TaskFlow AI. All Rights Reserved.</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-[var(--text-tertiary)]">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
            <span>by TaskFlow Team</span>
          </div>

          <div className="flex items-center gap-5 text-[var(--text-tertiary)]">
            {[
              { icon: Globe, label: 'GitHub' },
              { icon: Users, label: 'LinkedIn' },
              { icon: MessageCircle, label: 'Twitter' },
              { icon: Share2, label: 'Facebook' },
              { icon: Hash, label: 'Instagram' }
            ].map((social, idx) => (
              <motion.a 
                key={idx}
                href="#"
                whileHover="hover"
                variants={socialVariants}
                className="hover:text-[var(--color-primary)] transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
