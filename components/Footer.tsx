import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-600 p-1.5 rounded">
              <span className="text-white font-bold text-xs">US</span>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              UVESH <span className="text-orange-600">SCRAP</span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed mb-6">
            Trusted appliance recycling and scrap services across Delhi NCR. 
            Sustainable disposal with fair market pricing.
          </p>
          <div className="flex gap-4">
            <Facebook className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Contact Info</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 shrink-0" />
              <span>LGf 3A, 48/1, Near GDA Market, Block A, Sector 3, Vaishali, Ghaziabad, UP 201010</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-orange-600 shrink-0" />
              <span>074284 80714</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600 shrink-0" />
              <span>Open 10:00 AM - 10:00 PM</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
            <li><a href="#pickup" className="hover:text-white transition-colors">Request Pickup</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
        © {new Date().getFullYear()} Uvesh Scrap. All rights reserved.
      </div>
    </footer>
  );
}
