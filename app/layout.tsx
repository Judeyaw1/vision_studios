import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Vision Studios — Wedding & Event Photography',
  description:
    'Vision Studios captures the beauty of love, light, and life\'s most meaningful moments. Wedding, event, and portrait photography in the DMV area.',
  keywords: ['wedding photography', 'event photography', 'Vision Studios', 'DMV photography'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Vision Studios — Wedding & Event Photography',
    description: 'Capturing love stories across the DMV.',
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
