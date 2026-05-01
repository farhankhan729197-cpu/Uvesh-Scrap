'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { InquiryCard } from '@/components/InquiryDisplay';
import { Loader2, ShieldAlert, TrendingUp, PackageCheck, ClipboardList, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPage() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const timer = setTimeout(() => setLoading(true), 0);
    const q = query(
      collection(db, 'inquiries'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching all inquiries:", err);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [isAdmin]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Check console for details.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-32 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
            <p className="text-slate-500 mb-8">This area is reserved for the owner (UVESH SCRAP Admin).</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Stats
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    done: inquiries.filter(i => i.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-emerald-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative z-10">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h1 className="text-6xl font-black text-slate-800 tracking-tight leading-none mb-3">ADMIN DESK</h1>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live Monitoring Hub</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white text-[11px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
              Logged as: {user?.email}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Received", val: stats.total, color: "bg-blue-500" },
              { label: "Awaiting Action", val: stats.pending, color: "bg-amber-500" },
              { label: "Done & Verified", val: stats.done, color: "bg-emerald-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-xl border border-white rounded-[32px] p-8 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("w-2 h-2 rounded-full", stat.color)} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</span>
                </div>
                <div className="text-5xl font-black text-slate-800 tracking-tighter leading-none">{stat.val}</div>
              </div>
            ))}
          </div>
        </header>

        <section className="space-y-10">
          <div className="flex items-end justify-between border-b-2 border-slate-200 pb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2 lowercase">inquiry database</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time update stream</p>
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-xl border border-white p-20 rounded-[48px] text-center shadow-lg">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">System Clear: No Inquiries</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.map((inquiry) => (
                <InquiryCard 
                  key={inquiry.id} 
                  inquiry={inquiry} 
                  isAdmin={true} 
                  onUpdateStatus={updateStatus} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
