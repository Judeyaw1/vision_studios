import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const values = [
  {
    title: 'Documentary Heart',
    body: 'We let moments unfold naturally. No forced poses — just real emotion, real light, real stories.',
  },
  {
    title: 'Cinematic Eye',
    body: 'Every frame is composed with intention. We look for the geometry of love in unexpected places.',
  },
  {
    title: 'Quiet Presence',
    body: "Our clients forget we're there. That's exactly when the best photographs are made.",
  },
];

const awards = [
  'Vision Studios — DMV Area Photography',
  'Wedding & Event Photography Specialist',
  'Portrait & Lifestyle Photography',
  'Birthday & Milestone Celebrations',
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end pb-16 overflow-hidden">
        <Image
          src="/images/0M0A6970.jpeg"
          alt="Wedding ceremony"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">About</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-[#f0ebe3]">The Story</h1>
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-28 grid md:grid-cols-2 gap-20 items-start">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Meet the Artist</p>
          <h2 className="font-serif text-4xl font-light text-[#f0ebe3] mb-8 leading-tight">
            Vision Studios,<br />
            <em className="italic">Photography</em>
          </h2>
          <div className="space-y-5 text-[#6b6460] leading-relaxed">
            <p>
              At Vision Studios, we recognise the incredible importance of immortalising the magic
              and emotions of your most treasured occasions — whether it&apos;s your wedding day,
              a milestone birthday, or a portrait session that captures who you truly are.
            </p>
            <p>
              With a perfect combination of creativity, expertise, and cutting-edge equipment, we
              excel at transforming ephemeral moments into everlasting memories that you and your
              loved ones will cherish for generations.
            </p>
            <p>
              Based in the DMV area, we bring a documentary heart and a cinematic eye to every
              session — staying quiet enough that the real moments happen, and present enough to
              capture them forever.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="relative h-130">
            <Image
              src="/images/IMG_3179.jpeg"
              alt="Elegant portrait"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 52%' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-serif text-3xl text-[#c9a96e]">50+</p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#6b6460] mt-1">Sessions captured</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-[#c9a96e]">2+</p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#6b6460] mt-1">Years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#111009] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">How We Work</p>
          <h2 className="font-serif text-4xl font-light text-[#f0ebe3] mb-16">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {values.map(({ title, body }) => (
              <div key={title}>
                <div className="w-8 h-px bg-[#c9a96e] mb-6" />
                <h3 className="font-serif text-xl text-[#f0ebe3] mb-4">{title}</h3>
                <p className="text-[#6b6460] leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Specialities</p>
        <h2 className="font-serif text-4xl font-light text-[#f0ebe3] mb-12">What We Capture</h2>
        <ul className="space-y-5">
          {awards.map((item) => (
            <li key={item} className="flex items-center gap-5 border-b border-white/5 pb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] flex-shrink-0" />
              <span className="text-[#6b6460]">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Gallery row */}
      <section className="bg-[#111009] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64">
              <Image src="/images/0M0A6831.jpeg" alt="Wedding couple" fill className="object-cover object-top" sizes="25vw" />
            </div>
            <div className="relative h-64">
              <Image src="/images/0M0A0793.jpeg" alt="Portrait" fill className="object-cover object-top" sizes="25vw" />
            </div>
            <div className="relative h-64">
              <Image src="/images/IMG_3218.jpeg" alt="Elegant portrait" fill className="object-cover object-top" sizes="25vw" />
            </div>
            <div className="relative h-64">
              <Image src="/images/0M0A7015.jpeg" alt="Wedding ring" fill className="object-cover object-top" sizes="25vw" />
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-5">Get In Touch</p>
            <h2 className="font-serif text-4xl font-light text-[#f0ebe3] mb-6">
              Let&apos;s Create<br />
              <em className="italic">Together</em>
            </h2>
            <p className="text-[#6b6460] leading-relaxed mb-4">
              <strong className="text-[#f0ebe3]/60">Phone:</strong> (240) 941-7140
            </p>
            <p className="text-[#6b6460] leading-relaxed mb-8">
              <strong className="text-[#f0ebe3]/60">Email:</strong> VisionStudios@gmail.com
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c9a96e] hover:gap-5 transition-all"
            >
              Book a Session <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
