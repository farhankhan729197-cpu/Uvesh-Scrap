'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { InquiryCard } from '@/components/InquiryDisplay';
import { Loader2, Plus, LogIn, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => setLoading(true), 0);
    const q = query(
      collection(db, 'inquiries'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching inquiries:", err);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-32 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto">
            <LogIn className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h1>
            <p className="text-slate-500 mb-8">Please sign in to view your inquiry history and track status.</p>
            <Button asChild className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-20 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tight leading-none mb-3">MY INQUIRIES</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Track & Manage Scrap Requests</p>
          </div>
          <Link href="/#inquiry-form" className="group flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            New Inquiry
          </Link>
        </header>

        {inquiries.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-20 rounded-[48px] text-center shadow-2xl">
            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-100 text-slate-300">
              <ClipboardList className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Empty List</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-10 opacity-60">No pending or past inquiries found</p>
            <Link href="/#inquiry-form" className="inline-flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-slate-800 shadow-xl hover:bg-slate-50 transition-all transition-transform hover:-translate-y-1">
              Start Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inquiries.map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}

        <div className="mt-20 p-12 bg-slate-900 rounded-[48px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div className="max-w-md">
              <h3 className="text-3xl font-black text-white tracking-tight mb-4 leading-none lowercase group-hover:text-emerald-400 transition-colors">support & help center</h3>
              <p className="text-slate-400 font-medium tracking-tight leading-relaxed">
                Need immediate assistance? Our dedicated field representative is available 24/7 for NCR pickups.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-1 hover:bg-white/10 transition-colors">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Call Desk</div>
                <div className="text-md font-bold text-white tracking-tight leading-none">+91 74284 80714</div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-1 hover:bg-white/10 transition-colors">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Direct Mail</div>
                <div className="text-md font-bold text-white tracking-tight leading-none">farhankhan729197@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
