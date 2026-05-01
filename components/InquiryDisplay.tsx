'use client';

import React from 'react';
import { Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { label: string, color: string, icon: any }> = {
    pending: { label: 'PENDING', color: 'bg-amber-500/10 text-amber-700 border-amber-500/20', icon: Clock },
    picked_up: { label: 'PICKED UP', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: Truck },
    done: { label: 'COMPLETED', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', icon: CheckCircle2 },
    rejected: { label: 'REJECTED', color: 'bg-red-500/10 text-red-700 border-red-500/20', icon: XCircle },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest border backdrop-blur-md", config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export const InquiryCard = ({ inquiry, onUpdateStatus, isAdmin = false }: { inquiry: any, onUpdateStatus?: (id: string, status: string) => void, isAdmin?: boolean }) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-full bg-slate-200/50 transition-colors group-hover:bg-emerald-500" />
      
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 capitalize tracking-tight leading-none mb-1">
            {inquiry.applianceType.replace('_', ' ')}
          </h3>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">{inquiry.brand} • {inquiry.model || 'STANDARD'}</p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-white/50">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pickup Date</p>
            <p className="text-xs font-bold text-slate-700">{new Date(inquiry.pickupDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-white/50">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Address</p>
            <p className="text-xs font-bold text-slate-700 line-clamp-1" title={inquiry.address}>{inquiry.address}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/5 rounded-2xl p-5 mb-8 border border-white/20">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Condition Details</p>
        <p className="text-xs font-medium text-slate-600 italic leading-relaxed">{inquiry.condition}</p>
      </div>

      {inquiry.photos && inquiry.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {inquiry.photos.map((photo: string, i: number) => (
            <div key={i} className="w-16 h-16 rounded-2xl overflow-hidden border border-white shadow-sm shrink-0 transition-transform hover:scale-105">
              <img src={photo} alt="product" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {isAdmin && onUpdateStatus && (
        <div className="flex flex-wrap gap-2 pt-8 border-t border-white/40">
          {['pending', 'picked_up', 'done', 'rejected'].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={inquiry.status === s ? 'default' : 'outline'}
              className={cn(
                "text-[9px] h-8 px-4 font-black uppercase tracking-widest rounded-full border-white/50",
                inquiry.status === s ? "bg-slate-900 text-white" : "bg-white/50 hover:bg-white"
              )}
              onClick={() => onUpdateStatus(inquiry.id, s)}
            >
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>
      )}
      
      {!isAdmin && inquiry.status === 'pending' && (
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
          <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
            Awaiting Representative Call
          </p>
        </div>
      )}
    </div>
  );
};
