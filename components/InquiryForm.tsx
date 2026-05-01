'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const APPLIANCE_TYPES = [
  { id: 'ac', label: 'Air Conditioner', icon: '❄️' },
  { id: 'fridge', label: 'Refrigerator', icon: '🧊' },
  { id: 'battery', label: 'Inverter/Battery', icon: '🔋' },
  { id: 'washing_machine', label: 'Washing Machine', icon: '🧺' },
  { id: 'tv', label: 'Television', icon: '📺' },
  { id: 'laptop', label: 'Laptop/PCs', icon: '💻' },
  { id: 'other', label: 'Other Scrap', icon: '♻️' },
];

const BRANDS: Record<string, string[]> = {
  ac: ['LG', 'Samsung', 'Daikin', 'Voltas', 'Blue Star', 'Lloyd', 'Other'],
  fridge: ['LG', 'Samsung', 'Whirlpool', 'Godrej', 'Haier', 'Other'],
  washing_machine: ['IFB', 'LG', 'Samsung', 'Whirlpool', 'Bosch', 'Other'],
  battery: ['Exide', 'Luminous', 'Microtek', 'Amara Raja', 'Other'],
  tv: ['Sony', 'Samsung', 'LG', 'Mi', 'OnePlus', 'Other'],
  laptop: ['HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Other'],
  other: ['Various'],
};

export function InquiryForm() {
  const { user, signInWithGoogle } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applianceType: '',
    brand: '',
    model: '',
    condition: 'Working',
    address: '',
    pickupDate: '',
    photos: [] as string[],
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      signInWithGoogle();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate location area (basic string check for demo)
      const validAreas = ['delhi', 'noida', 'ghaziabad', 'greater noida', 'vaishali', 'vasundhara', 'kaushambi'];
      const locationLower = formData.address.toLowerCase();
      const isWithinServiceArea = validAreas.some(area => locationLower.includes(area));

      if (!isWithinServiceArea) {
        throw new Error("Sorry, we currently only serve Delhi, Noida, Ghaziabad, and Greater Noida.");
      }

      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        customerId: user.uid,
        customerEmail: user.email,
        customerName: user.displayName,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-display font-bold text-gray-900">Inquiry Submitted!</h3>
        <p className="text-gray-500">
          Our team will review your appliance details and contact you shortly for pickup.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setStep(1); setFormData({
            applianceType: '', brand: '', model: '', condition: 'Working', address: '', pickupDate: '', photos: []
          }); }}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
        <motion.div 
          className="h-full bg-orange-600"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-gray-900">What are you selling?</h3>
                <p className="text-sm text-gray-500">Select your appliance type and brand</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {APPLIANCE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, applianceType: type.id })}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.applianceType === type.id 
                      ? 'border-orange-600 bg-orange-50 text-orange-600' 
                      : 'border-gray-100 hover:border-orange-200 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-xs font-bold leading-tight">{type.label}</span>
                  </button>
                ))}
              </div>

              {formData.applianceType && (
                <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Brand</label>
                    <select 
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-600 outline-none"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                    >
                      <option value="">Select Brand</option>
                      {BRANDS[formData.applianceType]?.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Model / Description</label>
                    <input 
                      type="text"
                      placeholder="e.g. 1.5 Ton Split AC, 5 Star"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-600 outline-none"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <button 
                type="button"
                disabled={!formData.applianceType || !formData.brand || !formData.model}
                onClick={nextStep}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-all group"
              >
                Next Step <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-gray-900">Photos & Condition</h3>
                <p className="text-sm text-gray-500">The better the photos, the more accurate our quote</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Condition</label>
                <div className="flex gap-2">
                  {['Working', 'Not Working', 'Damaged/Broken'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                        formData.condition === cond 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-100 text-gray-400'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button 
                  type="button"
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-orange-400 hover:text-orange-400 transition-all bg-gray-50"
                  onClick={() => alert('Photo upload would go here')}
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                </button>
                {/* Mocked Photo Placeholders */}
                {[1,2,3].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-200" />
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border-2 border-gray-100 text-gray-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" /> Back
                </button>
                <button 
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 group transition-all"
                >
                  Next Step <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-gray-900">Pickup Details</h3>
                <p className="text-sm text-gray-500">Where and when should we collect it?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" /> Address in Delhi NCR
                  </label>
                  <textarea 
                    placeholder="Full address (House no, Street, Area, City)..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-600 outline-none h-24 text-sm"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((pos) => {
                            setFormData({
                              ...formData,
                              address: `${formData.address} (GPS: ${pos.coords.latitude}, ${pos.coords.longitude})`.trim()
                            });
                          });
                        }
                      }}
                      className="text-[10px] font-bold text-orange-600 flex items-center gap-1 hover:underline"
                    >
                      <MapPin className="h-3 w-3" /> Use Current Location
                    </button>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
                    <p className="text-[10px] font-medium text-yellow-700">
                      Service limited to Delhi, Ghaziabad, Noida, and Greater Noida.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" /> Preferred Pickup Date
                  </label>
                  <input 
                    type="date"
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-600 outline-none"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={prevStep}
                  className="flex-1 border-2 border-gray-100 text-gray-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" /> Back
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !formData.address || !formData.pickupDate}
                  className="flex-[2] bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 disabled:opacity-50 shadow-lg shadow-orange-200 transition-all"
                >
                  {isSubmitting ? 'Submitting...' : user ? 'Submit Inquiry' : 'Login to Submit'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
