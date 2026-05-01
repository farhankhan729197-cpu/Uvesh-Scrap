'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { APPLIANCE_TYPES, SERVICE_AREAS } from '@/lib/constants';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Camera, MapPin, Calendar, CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/use-auth';
import { signInWithGoogle } from '@/lib/firebase';

const formSchema = z.object({
  applianceType: z.string().min(1, 'Please select an appliance type'),
  brand: z.string().min(1, 'Please select a brand'),
  model: z.string().optional(),
  condition: z.string().min(10, 'Please provide more details about the condition'),
  address: z.string().min(10, 'Please provide a full address for pickup'),
  pickupDate: z.string().min(1, 'Please select a convenient pickup date'),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

type FormValues = z.infer<typeof formSchema>;

export const InquiryForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applianceType: 'ac',
      status: 'pending'
    } as any
  });

  const selectedType = watch('applianceType');
  const typeData = APPLIANCE_TYPES.find(t => t.value === selectedType);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === Array.from(files).length) {
            setSelectedPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const getGeoLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(pos);
        setValue('location', pos);
      }, (err) => {
        console.error("Error getting location:", err);
        setError("Could not get precise location. Please ensure location permissions are enabled.");
      });
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      setError("Please login to submit an inquiry.");
      return;
    }

    setLoading(true);
    setError(null);

    const inquiryData = {
      ...values,
      userId: user.uid,
      userName: user.displayName || user.email,
      userEmail: user.email,
      photos: selectedPhotos,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'inquiries'), inquiryData);
      setSuccess(true);
      reset();
      setSelectedPhotos([]);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'inquiries');
      setError("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center border border-emerald-100"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Inquiry Submitted!</h2>
        <p className="text-slate-600 mb-6">
          Thank you for choosing UVESH SCRAP. Our representative will contact you shortly to confirm the pickup and price.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
          Submit Another Inquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white/70 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl p-8 relative overflow-hidden">
      <div className="mb-8 text-center sm:text-left">
        <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Sell Your Appliance</h3>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Fill details to get an instant quote and book pickup.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Appliance Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Appliance Type</label>
          <select 
            {...register('applianceType')}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
          >
            {APPLIANCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.applianceType && <p className="text-[10px] text-red-500 font-bold px-1">{errors.applianceType.message}</p>}
        </div>

        {/* Brand */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Brand</label>
          <select 
            {...register('brand')}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Brand</option>
            {typeData?.brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
            <option value="other">Other</option>
          </select>
          {errors.brand && <p className="text-[10px] text-red-500 font-bold px-1">{errors.brand.message}</p>}
        </div>

        {/* Condition */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Description & Condition</label>
          <textarea 
            {...register('condition')}
            placeholder="e.g. Working condition, compressor missing..."
            className="w-full min-h-[80px] bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
          />
          {errors.condition && <p className="text-[10px] text-red-500 font-bold px-1">{errors.condition.message}</p>}
        </div>

        {/* Address */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pickup Address (NCR Only)</label>
          <div className="relative">
            <input 
              {...register('address')}
              placeholder="Detailed house address & Landmark..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all pl-4 pr-10"
            />
            <button 
              type="button" 
              onClick={getGeoLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Get current location"
            >
              <MapPin className={cn("w-4 h-4", currentLocation && "fill-emerald-600")} />
            </button>
          </div>
          {errors.address && <p className="text-[10px] text-red-500 font-bold px-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:col-span-2">
          {/* Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preferred Date</label>
            <input 
              type="date"
              {...register('pickupDate')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          {/* Photos */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Photos</label>
            <label className="w-full h-[46px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-2 text-[11px] font-bold text-slate-500 flex items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
              <Camera className="w-4 h-4" />
              Upload
              <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {selectedPhotos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2">
          {selectedPhotos.map((photo, i) => (
            <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
              <img src={photo} alt={`Preview ${i}`} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setSelectedPhotos(prev => prev.filter((_, idx) => idx !== i))}
                className="absolute inset-0 bg-red-500/80 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[8px] font-bold"
              >
                DEL
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-[11px] font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {user ? (
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xl mt-2 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none hover:bg-slate-800 tracking-tight"
        >
          {loading ? "SUBMITTING..." : "SUBMIT INQUIRY"}
        </button>
      ) : (
        <button 
          type="button" 
          onClick={() => signInWithGoogle()} 
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xl mt-2 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all hover:bg-slate-800 tracking-tight"
        >
          LOGIN TO SUBMIT
        </button>
      )}

      <p className="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">
        Verified Safe Pickup & On-the-spot Payment.
      </p>
    </form>
  );
};
