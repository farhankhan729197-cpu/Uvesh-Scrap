'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { InquiryForm } from '@/components/InquiryForm';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Trash2, 
  Truck, 
  IndianRupee, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <IndianRupee className="w-6 h-6" />,
    title: "Best Market Price",
    description: "We offer competitive pricing for all types of electronic and household metal scrap."
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Doorstep Pickup",
    description: "Contactless and hassle-free pickup from your home or office in Delhi NCR."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Instant Payment",
    description: "Get paid instantly via cash or digital transfer once our team verifies the appliance."
  }
];

const serviceAreas = [
  "Delhi", "Ghaziabad", "Noida", "Greater Noida", "Vasundhara", "Vaishali", "Kaushambi"
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-blue-100/30 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-emerald-50/50 rounded-full blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800 mb-8 shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  No. 1 Scrap Buyer in Delhi NCR
                </div>

                <h1 className="text-6xl lg:text-8xl font-black text-slate-800 tracking-tight leading-[0.85] mb-8">
                  SELL YOUR<br />
                  <span className="text-emerald-600">OLD GEAR</span><br />
                  FOR CASH.
                </h1>

                <p className="text-xl text-slate-500 font-medium tracking-tight leading-relaxed max-w-lg mb-10">
                  Direct pickup for ACs, Fridges, and Batteries. Pro service across Delhi, Noida & Ghaziabad. Fast, Safe, Verified.
                </p>

                <div className="grid grid-cols-3 gap-6 pt-4">
                  {[
                    { label: "FAIR PRICE", val: "Top Value" },
                    { label: "DOORSTEP", val: "Free Pickup" },
                    { label: "INSTANT", val: "Fast Cash" }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                      <div className="text-sm font-bold text-slate-800">{stat.val}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Visual Accent for Form */}
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-2xl -z-10" />
                <InquiryForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ticker */}
      <section className="py-10 bg-white/30 backdrop-blur-sm border-y border-white/40 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-x-16 gap-y-8 items-center grayscale opacity-40">
          <span className="text-2xl font-black tracking-tighter text-slate-400">VOLTAS</span>
          <span className="text-2xl font-black tracking-tighter text-slate-400">SAMSUNG</span>
          <span className="text-2xl font-black tracking-tighter text-slate-400">LG ELECTRONICS</span>
          <span className="text-2xl font-black tracking-tighter text-slate-400">DAIKIN</span>
          <span className="text-2xl font-black tracking-tighter text-slate-400">BLUE STAR</span>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative z-10" id="services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl lg:text-7xl font-black text-slate-800 tracking-tighter leading-none mb-6">
                HIGH VALUE<br />RECYCLING.
              </h2>
              <p className="text-lg text-slate-500 font-medium tracking-tight">
                Bulk or individual, we buy all types of industrial and domestic appliance scrap at the highest market rates.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-1 bg-emerald-600 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "AC SCRAP", desc: "Window, Split & Industrial units.", icon: "❄️" },
              { title: "REFRIGIRATION", desc: "Commercial & domestic fridges.", icon: "🧊" },
              { title: "BATTERIES", desc: "Inverters, Solar & Car batteries.", icon: "🔋" },
              { title: "LAUNDRY", desc: "Washing machines & Dryers.", icon: "🧺" },
            ].map((service, i) => (
              <div key={i} className="group p-10 rounded-[32px] bg-white/40 backdrop-blur-md border border-white shadow-sm hover:shadow-xl hover:bg-white/60 transition-all duration-500">
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{service.title}</h3>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed tracking-tight">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 relative z-10" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-900 rounded-[48px] p-8 lg:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500 rounded-full blur-[120px]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="text-emerald-400 text-[11px] font-black uppercase tracking-[0.3em]">Direct Partner</div>
                  <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                    SERVING NCR<br />FOR 15 YEARS.
                  </h2>
                  <p className="text-xl text-slate-400 font-medium leading-relaxed tracking-tight">
                    UVESH SCRAP provides professional, localized recycling solutions with a focus on Vaishali, Ghaziabad and beyond.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Office</div>
                    <p className="text-sm font-bold text-slate-200">Sector 3, Vaishali,<br />Ghaziabad, UP</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Contact</div>
                    <p className="text-sm font-bold text-slate-200">+91 74284 80714<br />contact@uveshscrap.com</p>
                  </div>
                </div>

                <div className="pt-8 flex flex-wrap gap-2">
                  {serviceAreas.map(area => (
                    <span key={area} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/10 relative transition-transform duration-700 group-hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/junkyard/800/1000" alt="Scrap Yard" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-emerald-600 p-10 rounded-[32px] shadow-2xl animate-float">
                  <div className="text-5xl font-black text-white italic tracking-tighter">15Y+</div>
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-80 mt-1">Direct Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-xl border-t border-white pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5 space-y-8">
              <div className="text-3xl font-black tracking-tighter text-slate-800">UVESH SCRAP</div>
              <p className="text-lg text-slate-500 font-medium tracking-tight max-w-sm">
                Turning electronic waste into ecological value since 2009.
              </p>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-700">
                <li><Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link></li>
                <li><Link href="#services" className="hover:text-emerald-600 transition-colors">Services</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-600 transition-colors">My Account</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Legal & Area</h4>
              <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs">
                Authorized recycling partner covering complete NCR region. Environmentally safe disposal guaranteed.
              </p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} UVESH SCRAP (यूवेश स्क्रैप). All rights reserved.
            </div>
            <div className="flex gap-8 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
              <span>Security Verified</span>
              <span>Payment Secure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
