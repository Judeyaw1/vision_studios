import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Vision Studio — Wedding & Event Photography',
  description:
    'Vision Studio captures the beauty of love, light, and life\'s most meaningful moments. Award-winning wedding and event photography.',
  keywords: ['wedding photography', 'event photography', 'Vision Studio', 'Jose Vargas'],
  openGraph: {
    title: 'Vision Studio — Wedding & Event Photography',
    description: 'Capturing love stories across the globe.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0c0b09] text-[#f0ebe3]">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
