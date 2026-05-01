import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InquiryForm } from '@/components/InquiryForm';
import { 
  CheckCircle, 
  Truck, 
  BadgeIndianRupee, 
  ShieldCheck, 
  Recycle,
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-orange-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,237,213,0.5),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,237,213,0.3),transparent_40%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full text-orange-700 text-xs font-bold uppercase tracking-wider">
                  <Star className="h-3 w-3 fill-orange-600" /> Delhi NCR&apos;s Most Trusted Scrap Dealer
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                  Turn Your Old <span className="text-orange-600 block">Appliances into Cash.</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                  Fast, fair, and hassle-free pickup for ACs, fridges, washing machines, and batteries. Serving Delhi, Noida, and Ghaziabad.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-900 p-2 rounded-lg"><Truck className="h-4 w-4 text-white" /></div>
                  <span className="text-xs font-bold text-gray-900 uppercase">Instant<br/>Pickup</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-900 p-2 rounded-lg"><BadgeIndianRupee className="h-4 w-4 text-white" /></div>
                  <span className="text-xs font-bold text-gray-900 uppercase">Spot<br/>Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-900 p-2 rounded-lg"><ShieldCheck className="h-4 w-4 text-white" /></div>
                  <span className="text-xs font-bold text-gray-900 uppercase">Verified<br/>Service</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm"><MapPin className="h-6 w-6 text-orange-600" /></div>
                <div>
                  <h4 className="font-bold text-gray-900">Uvesh Scrap Centre</h4>
                  <p className="text-sm text-gray-500">Vaishali Sector 3, Ghaziabad</p>
                  <p className="text-xs font-semibold text-orange-600 mt-1">Open Today until 10:00 PM</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20 border border-orange-100 hidden md:block">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-orange-500 fill-orange-500" />)}
                  </div>
                  <span className="text-[10px] font-bold text-gray-900">5.0 (76 Reviews)</span>
                </div>
                <p className="text-[10px] text-gray-400">Google Scrap Dealer</p>
              </div>
              
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500">Three simple steps to sell your old electronics and appliances.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'List Appliance', 
                desc: 'Fill out the form with appliance details, condition, and photos.',
                icon: Recycle
              },
              { 
                step: '02', 
                title: 'Get Appointment', 
                desc: 'Choose a convenient pickup date for our team to visit your location.',
                icon: Clock
              },
              { 
                step: '03', 
                title: 'Instant Payment', 
                desc: 'Get paid on the spot after our team verifies the product condition.',
                icon: BadgeIndianRupee
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-6xl font-display font-black text-gray-50 group-hover:text-orange-50 transition-colors">
                  {item.step}
                </div>
                <div className="bg-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white relative z-10 transition-transform group-hover:rotate-12">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-gray-50 p-8 md:p-16 rounded-[3rem] border border-gray-100">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-gray-900">Terms of Service</h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Please read carefully before listing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-orange-100 p-2 rounded-lg shrink-0 h-fit"><MapPin className="h-4 w-4 text-orange-600" /></div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Service Area</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Pickup service is strictly limited to Delhi, Ghaziabad, Noida, and Greater Noida (including Vasundhara, Vaishali, and Kaushambi).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-orange-100 p-2 rounded-lg shrink-0 h-fit"><ShieldCheck className="h-4 w-4 text-orange-600" /></div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Condition Mapping</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Condition and photos must match actual appliance. Quoted prices may change if condition differs upon inspection.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-orange-100 p-2 rounded-lg shrink-0 h-fit"><BadgeIndianRupee className="h-4 w-4 text-orange-600" /></div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Payment & Returns</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Payment made after verification. All sales are final after collection; items cannot be returned or refunded.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-orange-100 p-2 rounded-lg shrink-0 h-fit"><CheckCircle className="h-4 w-4 text-orange-600" /></div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Preparation</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Remove personal items and data (laptops/fridges). We are not responsible for belongings left behind.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
