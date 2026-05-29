'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import VenueAutocomplete from '../components/VenueAutocomplete';

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  venue: string;
  guests: string;
  package: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  date: '',
  venue: '',
  guests: '',
  package: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      let formatted = digits;
      if (digits.length >= 7) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length >= 4) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length >= 1) {
        formatted = `(${digits}`;
      }
      setForm((prev) => ({ ...prev, phone: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm(initialForm);
  };

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4">Get In Touch</p>
        <h1 className="font-serif text-5xl sm:text-6xl font-light text-[#f0ebe3]">
          Let&apos;s Create<br />
          <em className="italic text-[#c9a96e]">Together</em>
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-32 grid lg:grid-cols-5 gap-20">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#c9a96e] mb-5">Contact</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Mail size={16} className="text-[#c9a96e] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#6b6460]">Email</p>
                  <a href="mailto:hello@visionstudio.com" className="text-[#f0ebe3] hover:text-[#c9a96e] transition-colors">
                    hello@visionstudio.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={16} className="text-[#c9a96e] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#6b6460]">Phone</p>
                  <a href="tel:+15550001234" className="text-[#f0ebe3] hover:text-[#c9a96e] transition-colors">
                    +1 (555) 000-1234
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={16} className="text-[#c9a96e] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#6b6460]">Based in</p>
                  <span className="text-[#f0ebe3]">New York & Miami — Available worldwide</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#c9a96e] mb-5">Availability</p>
            <p className="text-[#6b6460] text-sm leading-relaxed">
              We typically book 12–18 months in advance. Send us a note even if your date is soon —
              we love last-minute adventures and occasionally have openings.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#c9a96e] mb-5">Response Time</p>
            <p className="text-[#6b6460] text-sm leading-relaxed">
              We reply to every inquiry within 24–48 hours, Monday through Friday.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="border border-[#c9a96e]/30 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mx-auto mb-6">
                <Send size={20} className="text-[#c9a96e]" />
              </div>
              <h2 className="font-serif text-3xl text-[#f0ebe3] mb-4">Message Sent</h2>
              <p className="text-[#6b6460] leading-relaxed mb-8">
                Thank you for reaching out. We&apos;ll be in touch within 24–48 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#f0ebe3] transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none transition-colors text-sm"
                    placeholder="Jane & John"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none transition-colors text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none transition-colors text-sm"
                    placeholder="+1 555 000 0000"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 text-[#f0ebe3] focus:border-[#c9a96e] focus:outline-none transition-colors text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                    Venue / Location
                  </label>
                  <VenueAutocomplete
                    value={form.venue}
                    onChange={(val) => setForm((prev) => ({ ...prev, venue: val }))}
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                    Estimated Guests
                  </label>
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full bg-[#0c0b09] border border-white/15 px-4 py-3 text-[#f0ebe3] focus:border-[#c9a96e] focus:outline-none transition-colors text-sm"
                  >
                    <option value="" className="text-[#6b6460]">Select range</option>
                    <option value="Under 50">Under 50</option>
                    <option value="50–100">50–100</option>
                    <option value="100–200">100–200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                  Package of Interest
                </label>
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className="w-full bg-[#0c0b09] border border-white/15 px-4 py-3 text-[#f0ebe3] focus:border-[#c9a96e] focus:outline-none transition-colors text-sm"
                >
                  <option value="">Not sure yet</option>
                  <option value="Elopement">Elopement — $2,400</option>
                  <option value="The Classic">The Classic — $4,800</option>
                  <option value="The Legacy">The Legacy — $7,500</option>
                  <option value="Custom">Custom / Let&apos;s discuss</option>
                </select>
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#6b6460] block mb-2">
                  Tell Us Your Story
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-[#f0ebe3] placeholder:text-[#6b6460]/60 focus:border-[#c9a96e] focus:outline-none transition-colors text-sm resize-none"
                  placeholder="How did you meet? What matters most to you on your day? Any details you'd like to share..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase px-10 py-5 bg-[#c9a96e] text-[#0c0b09] hover:bg-[#f0ebe3] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending…' : 'Send Enquiry'}
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
