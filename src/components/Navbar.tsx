import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-neutral-900 hover:text-blue-600 transition"
        >
          <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-neutral-700">
          <Link href="/films" className="hover:text-blue-600 transition">
            Films
          </Link>
          <Link href="/directors" className="hover:text-blue-600 transition">
            Réalisateurs
          </Link>
          <Link href="/actors" className="hover:text-blue-600 transition">
            Acteurs
          </Link>
          <Link href="/" className="hover:text-blue-600 transition">
            À la une
          </Link>
        </div>
        <SearchBar />
      </div>
    </nav>
  );
}
