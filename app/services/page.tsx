import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

const packages = [
  {
    name: 'Elopement',
    price: '$2,400',
    duration: 'Up to 4 hours',
    ideal: 'Intimate ceremonies, micro-weddings',
    features: [
      '1 photographer',
      'Up to 4 hours coverage',
      '300+ edited images',
      'Private online gallery',
      '2-week delivery',
      'Print release',
    ],
    featured: false,
  },
  {
    name: 'The Classic',
    price: '$4,800',
    duration: 'Up to 8 hours',
    ideal: 'Most popular — full-day weddings',
    features: [
      '2 photographers',
      'Up to 8 hours coverage',
      '600+ edited images',
      'Private online gallery',
      'Engagement session included',
      '2-week delivery',
      'Print release',
      'Wedding morning coverage',
    ],
    featured: true,
  },
  {
    name: 'The Legacy',
    price: '$7,500',
    duration: 'Unlimited hours',
    ideal: 'Multi-day events & destination weddings',
    features: [
      '2 photographers',
      'Unlimited hours',
      '1,000+ edited images',
      'Private online gallery',
      'Engagement session included',
      'Rehearsal dinner coverage',
      'Fine-art album (30 pages)',
      'Priority 1-week delivery',
      'Print release',
      'Travel included (domestic)',
    ],
    featured: false,
  },
];

const addOns = [
  { name: 'Fine-art album (30 pages)', price: '$850' },
  { name: 'Additional hours (per hour)', price: '$350' },
  { name: 'Engagement session', price: '$600' },
  { name: 'Portrait / headshot session', price: '$700' },
  { name: 'Rush delivery (1 week)', price: '$400' },
  { name: 'Travel outside DMV', price: 'Custom quote' },
];

const faqs = [
  {
    q: 'How far in advance should I book?',
    a: 'Most clients book 3–6 months in advance. We occasionally have last-minute openings — reach out to check.',
  },
  {
    q: 'Do you travel outside the DMV?',
    a: 'Absolutely. We are available for destination weddings and events. Travel outside the DMV area is quoted per project.',
  },
  {
    q: "What's your editing style?",
    a: 'Timeless, film-inspired tones with natural skin and true-to-life colour. We avoid heavy presets that date quickly.',
  },
  {
    q: 'How are images delivered?',
    a: 'Via a private, password-protected online gallery with high-resolution downloads and print ordering.',
  },
];

export default function ServicesPage() {
  return (
    <main className="pt-20">
      {/* Header */}
      <section className="relative h-[50vh] flex items-end pb-16 overflow-hidden">
        <Image
          src="/images/0M0A6831.jpeg"
          alt="Wedding couple"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">Investment</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-[#f0ebe3]">Services &amp; Pricing</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20 text-center">
        <p className="text-[#6b6460] leading-relaxed text-lg">
          Every package includes our full creative attention, consistent post-processing, and a relationship
          built on trust. We don&apos;t just deliver photos — we deliver peace of mind on the most important
          day of your life.
        </p>
      </section>

      {/* Packages */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-28">
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col p-8 border transition-colors ${
                pkg.featured
                  ? 'border-[#c9a96e] bg-[#111009]'
                  : 'border-white/8 hover:border-white/20'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-px left-8 text-xs tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0c0b09] px-3 py-1">
                  Most Popular
                </span>
              )}

              <div className="mb-8">
                <p className="text-xs tracking-[0.25em] uppercase text-[#c9a96e] mb-3">{pkg.duration}</p>
                <h2 className="font-serif text-3xl text-[#f0ebe3] mb-2">{pkg.name}</h2>
                <p className="text-[#6b6460] text-sm">{pkg.ideal}</p>
              </div>

              <div className="mb-8">
                <span className="font-serif text-5xl text-[#f0ebe3]">{pkg.price}</span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={14} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#6b6460]">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase py-4 transition-colors ${
                  pkg.featured
                    ? 'bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3]'
                    : 'border border-white/20 text-[#f0ebe3] hover:border-[#c9a96e] hover:text-[#c9a96e]'
                }`}
              >
                Book This Package <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-[#111009] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Enhance Your Package</p>
          <h2 className="font-serif text-4xl font-light text-[#f0ebe3] mb-12">Add-Ons</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {addOns.map(({ name, price }) => (
              <div key={name} className="bg-[#111009] p-6 flex justify-between items-center">
                <span className="text-[#6b6460] text-sm">{name}</span>
                <span className="font-serif text-lg text-[#c9a96e] ml-4 flex-shrink-0">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-24">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Common Questions</p>
        <h2 className="font-serif text-4xl font-light text-[#f0ebe3] mb-12">FAQ</h2>
        <div className="space-y-10">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b border-white/8 pb-10">
              <h3 className="font-serif text-xl text-[#f0ebe3] mb-3">{q}</h3>
              <p className="text-[#6b6460] leading-relaxed text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA with photo */}
      <section className="relative overflow-hidden py-36">
        <Image
          src="/images/0M0A6742.jpeg"
          alt="Wedding ceremony"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0c0b09]/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Let&apos;s Begin</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#f0ebe3] mb-10 max-w-xl mx-auto leading-tight">
            Not sure which package is right for you?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase px-10 py-5 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300"
          >
            Let&apos;s Talk <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
