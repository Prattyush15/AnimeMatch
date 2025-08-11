"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    clsx('px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      pathname === href ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100');

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">AnimeMatch</Link>
        <div className="flex items-center gap-2">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/watched" className={linkClass('/watched')}>Watched</Link>
          <Link href="/to-watch" className={linkClass('/to-watch')}>To Watch</Link>
          <Link href="/about" className={linkClass('/about')}>About</Link>
        </div>
      </div>
    </nav>
  );
}


