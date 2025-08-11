import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'AnimeMatch',
  description: 'Swipe anime you like. MVP Phase 1.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container mx-auto max-w-5xl px-4 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}


