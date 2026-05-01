'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Truck, Clock, CheckCircle, XCircle, ChevronRight, Package, MapPin, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'inquiries'),
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInquiries(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inquiries:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center font-display font-bold">Loading Auth...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center font-display font-extrabold text-2xl">Please Sign In to Access Dashboard</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-extrabold text-gray-900 tracking-tight">My Inquiries</h1>
              <p className="text-gray-500 text-sm">Track the status of your appliance sell requests.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold uppercase">Total Items</p>
                <p className="text-xl font-display font-black text-gray-900">{inquiries.length}</p>
              </div>
              <div className="h-10 w-px bg-gray-100" />
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 font-bold">Fetching your records...</div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 text-center space-y-4">
              <div className="bg-gray-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No inquiries found yet.</p>
              <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800">Start Selling</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.map((inquiry, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={inquiry.id} 
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="p-6 space-y-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {inquiry.applianceType?.replace('_', ' ')}
                      </div>
                      <StatusBadge status={inquiry.status} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-display font-bold text-gray-900">{inquiry.brand} {inquiry.model}</h3>
                      <p className="text-xs font-medium text-gray-400">Condition: <span className="text-gray-600">{inquiry.condition}</span></p>
                    </div>

                    <div className="pt-4 space-y-2 border-t border-gray-50">
                      <div className="flex items-start gap-2 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-gray-500 line-clamp-2">{inquiry.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-500">Pickup: <span className="font-bold text-gray-900">{inquiry.pickupDate}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Ref: {inquiry.id.slice(0,8)}</span>
                    <button className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
                      View Details <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Pending': 'bg-yellow-50 text-yellow-600',
    'Picked Up': 'bg-blue-50 text-blue-600',
    'Done': 'bg-green-50 text-green-600',
    'Rejected': 'bg-red-50 text-red-600',
  };
  const Icons: any = {
    'Pending': Clock,
    'Picked Up': Truck,
    'Done': CheckCircle,
    'Rejected': XCircle,
  };
  const Icon = Icons[status] || Clock;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${styles[status]}`}>
      <Icon className="h-3 w-3" />
      {status}
    </div>
  );
}
