"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BRANDS } from "@/lib/config/brands";
import Link from "next/link";


export default function RootLandingPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);
  const defaultBrand = BRANDS.find(b => b.id === "noblenestsco") || BRANDS[0];

  useEffect(() => {
    if (isCancelled) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(defaultBrand.path);
    }
  }, [countdown, isCancelled, router, defaultBrand.path]);

  const handleInteract = () => {
    setIsCancelled(true);
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-white/20"
      onMouseMove={handleInteract}
      onClick={handleInteract}
      onKeyDown={handleInteract}
    >
      <div className="max-w-4xl w-full text-center space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Verse by Sree Header */}
        <div className="space-y-4">
          <h1 className="font-heading text-4xl md:text-6xl tracking-widest uppercase text-white/90">
            Verse by Sree
          </h1>
          <p className="text-white/50 text-sm md:text-base tracking-[0.2em] uppercase">
            Building Meaningful Brands
          </p>
        </div>

        {/* Brands Section */}
        <div className="space-y-8 pt-12 border-t border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-8">
            Featured Brand
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-auto-fit gap-8 max-w-lg mx-auto">
            {BRANDS.map((brand) => (
              <Link
                href={brand.path}
                key={brand.id}
                className="group relative block bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-wide text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                    {brand.name}
                  </h2>
                  <p className="text-white/70 group-hover:text-white/90 text-sm leading-relaxed max-w-sm transition-colors duration-300">
                    {brand.description}
                  </p>
                  
                  <div className="w-full">
                    <div 
                      className="w-full bg-white text-black group-hover:bg-[#D4AF37] group-hover:text-black rounded-full h-12 flex items-center justify-center text-sm uppercase tracking-widest font-semibold transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    >
                      Explore {brand.name}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Redirect Notice */}
        <div className="h-8">
          {!isCancelled && (
            <p className="text-white/40 text-xs tracking-widest uppercase animate-pulse">
              Redirecting in {countdown}s... (Interact to cancel)
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
