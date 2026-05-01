'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, User, LogOut } from 'lucide-react';

export function Header() {
  const { user, signInWithGoogle, logOut, isAdmin } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-orange-600 p-2 rounded-lg group-hover:rotate-6 transition-transform">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gray-900">
            UVESH <span className="text-orange-600">SCRAP</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-orange-600">How it Works</Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-orange-600">Pricing</Link>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-600">My Inquiries</Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-orange-600 font-bold underline decoration-orange-600 underline-offset-4">Admin Panel</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">{user.displayName}</p>
                <button onClick={logOut} className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-red-500 transition-colors">Sign Out</button>
              </div>
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                <Image 
                  src={user.photoURL || 'https://picsum.photos/seed/user/32/32'} 
                  alt={user.displayName || 'User'} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <Button onClick={signInWithGoogle} variant="outline" className="gap-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Minimal button if shadcn isn't fully set up yet
function Button({ children, onClick, variant, className, ...props }: any) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2";
  const variants: any = {
    outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
    primary: "bg-orange-600 text-white hover:bg-orange-700",
  };
  return (
    <button className={`${base} ${variants[variant || 'primary']} ${className!}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
