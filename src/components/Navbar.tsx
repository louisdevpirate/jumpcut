'use client';

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`navbar-transparent w-full border-neutral-800 fixed top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'navbar-scrolled' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-blue-400 transition font-satoshi"
        >
          <Image src="/images/logo.png" alt="JumpCut" width={100} height={40} />
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-medium text-neutral-300 font-satoshi">
          <Link href="/" className="hover:text-white transition">
            Films
          </Link>
          <Link href="/my-list" className="hover:text-white transition">
            Ma Liste
          </Link>
          <Link href="/wishlist" className="hover:text-white transition">
            Wishlist
          </Link>
          <Link href="/personalities" className="hover:text-white transition">
            Personnalités
          </Link>
          <Link href="/stats" className="hover:text-white transition">
            Stats
          </Link>
          <Link href="/badges" className="hover:text-white transition">
            Badges
          </Link>
        </div>
        
        <SearchBar />
      </div>
    </nav>
  );
}
