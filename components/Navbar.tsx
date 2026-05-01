'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { signInWithGoogle, logout } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, profile, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  if (user) {
    navLinks.push({ name: 'My Inquiries', href: '/dashboard' });
    if (isAdmin) {
      navLinks.push({ name: 'Admin Panel', href: '/admin' });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group transition-transform hover:scale-105">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display tracking-tight text-slate-800 leading-none">
                  UVESH SCRAP
                </span>
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-[0.2em] mt-1">
                  यूवेश स्क्रैप
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-white/40 rounded-full shadow-sm">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                <button
                  onClick={() => signInWithGoogle()}
                  className="px-5 py-2 rounded-full border border-white/20 bg-white/50 backdrop-blur-md hover:bg-white/80 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => signInWithGoogle()}
                  className="px-5 py-2 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-emerald-600 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-slate-200 shadow-xl"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
