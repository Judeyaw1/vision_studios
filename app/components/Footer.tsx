import Link from 'next/link';
import Image from 'next/image';
import { Share2, ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Vision Studios"
              width={280}
              height={106}
              className="h-24 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-[#6b6460] text-sm leading-relaxed max-w-xs">
            Capturing the beauty of love, light, and life&apos;s most meaningful moments.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-5">Navigate</p>
          <ul className="space-y-3">
            {[
              ['/', 'Home'],
              ['/portfolio', 'Portfolio'],
              ['/about', 'About'],
              ['/services', 'Services'],
              ['/contact', 'Book a Session'],
              ['/clients', 'Client Gallery'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[#6b6460] hover:text-[#f0ebe3] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-5">Connect</p>
          <div className="flex gap-4 mb-6">
            <a href="#" aria-label="Instagram" className="text-[#6b6460] hover:text-[#c9a96e] transition-colors">
              <Share2 size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="text-[#6b6460] hover:text-[#c9a96e] transition-colors">
              <ExternalLink size={18} />
            </a>
            <a href="mailto:VisionStudios@gmail.com" aria-label="Email" className="text-[#6b6460] hover:text-[#c9a96e] transition-colors">
              <Mail size={18} />
            </a>
          </div>
          <p className="text-sm text-[#6b6460]">VisionStudios@gmail.com</p>
          <p className="text-sm text-[#6b6460] mt-1">(240) 941-7140</p>
        </div>
      </div>

      <div className="border-t border-white/5 max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-[#6b6460]">
          © {new Date().getFullYear()} Vision Studios. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <p className="text-xs text-[#6b6460]">Wedding &amp; Event Photography</p>
          <Link href="/admin" className="text-xs text-[#6b6460] hover:text-[#c9a96e] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
