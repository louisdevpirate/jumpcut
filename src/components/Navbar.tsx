import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <nav className="w-full bg-black/90 backdrop-blur-sm border-b border-neutral-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-blue-400 transition font-satoshi"
        >
          <Image src="/images/jumpcut.png" alt="JumpCut" width={60} height={40} />
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-medium text-neutral-300 font-satoshi">
          <Link href="/" className="hover:text-white transition">
            Films
          </Link>
          <Link href="/my-list" className="hover:text-white transition">
            Ma Liste
          </Link>
          <Link href="/directors" className="hover:text-white transition">
            Réalisateurs
          </Link>
          <Link href="/actors" className="hover:text-white transition">
            Acteurs
          </Link>
        </div>
        
        <SearchBar />
      </div>
    </nav>
  );
}
