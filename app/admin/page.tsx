'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { 
  BarChart3, 
  Package, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setInquiries(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const updateStatus = async (inquiryId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status,
        updatedAt: serverTimestamp()
      });
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center font-display font-bold">Checking Admin Privileges...</div>;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-display font-black text-gray-900">Access Denied</h1>
      <p className="text-gray-500">Only authorized team members can access this panel.</p>
      <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold">Return Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full overflow-hidden flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600" /> Management Dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-xl border border-gray-200">
               <p className="text-[10px] text-gray-400 font-black uppercase">Pending</p>
               <p className="text-xl font-display font-black text-orange-600">{inquiries.filter(i => i.status === 'Pending').length}</p>
             </div>
             <div className="bg-white px-4 py-2 rounded-xl border border-gray-200">
               <p className="text-[10px] text-gray-400 font-black uppercase">Completed</p>
               <p className="text-xl font-display font-black text-green-600">{inquiries.filter(i => i.status === 'Done').length}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden h-full">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
              <Search className="h-5 w-5 text-gray-300" />
              <input type="text" placeholder="Search customer, brand, or location..." className="flex-grow outline-none text-sm font-medium" />
              <Filter className="h-5 w-5 text-gray-300 cursor-pointer" />
            </div>

            {loading ? (
              <div className="py-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Loading inquiries...</div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group ${
                      selectedInquiry?.id === inquiry.id ? 'border-orange-600 shadow-md ring-1 ring-orange-600' : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">{inquiry.applianceType}</span>
                          <StatusBadge status={inquiry.status} />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-gray-900 text-lg">{inquiry.brand} {inquiry.model}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{inquiry.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-900">{inquiry.customerName}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {inquiry.createdAt?.toDate ? new Date(inquiry.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                        </p>
                        <MoreHorizontal className="h-5 w-5 text-gray-200 mt-2 ml-auto group-hover:text-gray-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedInquiry ? (
                <motion.div 
                  key="panel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl overflow-hidden flex flex-col h-fit sticky top-20"
                >
                  <div className="bg-gray-900 p-8 text-white space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-900/50">
                        <Package className="h-8 w-8" />
                      </div>
                      <button onClick={() => setSelectedInquiry(null)} className="text-gray-500 hover:text-white">✕</button>
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-black leading-tight tracking-tight">{selectedInquiry.brand}</h2>
                      <p className="text-gray-400 font-medium">{selectedInquiry.model}</p>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Customer Info</h5>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">{selectedInquiry.customerEmail}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                          <span className="text-gray-600 leading-relaxed">{selectedInquiry.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span>Pickup: {selectedInquiry.pickupDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       {['Pending', 'Picked Up', 'Done', 'Rejected'].map(s => (
                         <button 
                           key={s}
                           onClick={() => updateStatus(selectedInquiry.id, s)}
                           className={`flex-1 py-3 px-1 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                             selectedInquiry.status === s 
                             ? 'bg-gray-900 border-gray-900 text-white' 
                             : 'border-gray-100 text-gray-400 hover:border-gray-200'
                           }`}
                         >
                           {s.replace('Picked Up', 'Pickup')}
                         </button>
                       ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100">
                      <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
                        <CheckCircle className="h-4 w-4" /> Mark Done
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-100 rounded-[2.5rem] border-2 border-dashed border-gray-200 h-[500px] flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <Eye className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900">Inquiry Preview</h3>
                  <p className="text-xs text-gray-400 max-w-[200px]">Select any inquiry from the list to view full details and update status.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
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
  return (
    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </div>
  );
}
