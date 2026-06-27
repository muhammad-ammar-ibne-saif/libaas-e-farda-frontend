"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

export default function ContactPage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const brand = settings?.brand || {};

  const contactItems = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: brand.phone || "0300-1234567",
      href: `https://wa.me/${brand.whatsappNumber || "923001234567"}`,
      sub: "Fastest response — within 2 hours",
    },
    {
      icon: Mail,
      label: "Email",
      value: brand.email || "hello@libaas-e-farda.com",
      href: `mailto:${brand.email || "hello@libaas-e-farda.com"}`,
      sub: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      label: "Based In",
      value: brand.address || "Lahore, Pakistan",
      href: null,
      sub: "Shipping nationwide",
    },
    {
      icon: Clock,
      label: "Hours",
      value: brand.businessHours || "Mon–Sat, 10am–7pm PKT",
      href: null,
      sub: "Closed Sundays",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">
          Get In Touch
        </p>
        <h1 className="section-title mb-4">Contact Us</h1>
        <p className="font-body text-sm text-charcoal-light">
          We'd love to hear from you. Reach out via WhatsApp for the fastest
          response.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-14">
        <div>
          {sent ? (
            <div className="bg-sage-50 border border-sage-300 p-8 text-center">
              <p className="font-display text-3xl text-charcoal mb-3">
                Message Sent ✓
              </p>
              <p className="font-body text-sm text-charcoal-light">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              {[
                {
                  f: "name",
                  label: "Your Name",
                  type: "text",
                  ph: "Ayesha Raza",
                },
                {
                  f: "email",
                  label: "Email",
                  type: "email",
                  ph: "you@example.com",
                },
                {
                  f: "subject",
                  label: "Subject",
                  type: "text",
                  ph: "Order query, sizing help...",
                },
              ].map(({ f, label, type, ph }) => (
                <div key={f}>
                  <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[f]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f]: e.target.value }))
                    }
                    placeholder={ph}
                    className="w-full bg-ivory-50 border border-ivory-300 focus:border-charcoal px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-body tracking-wider text-charcoal-light mb-1.5">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full bg-ivory-50 border border-ivory-300 focus:border-charcoal px-4 py-3 text-sm font-body text-charcoal outline-none transition-colors resize-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          )}
        </div>
        <div className="space-y-8">
          <p className="font-body text-xs tracking-widest uppercase text-charcoal-light mb-6">
            Reach Us Directly
          </p>
          <div className="space-y-5">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-terracotta-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-terracotta-500" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-wider uppercase text-charcoal-light">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-body text-sm font-medium text-charcoal hover:text-terracotta-500 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-body text-sm font-medium text-charcoal">
                      {item.value}
                    </p>
                  )}
                  <p className="font-body text-xs text-charcoal-light mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <a
            href={`https://wa.me/${
              brand.whatsappNumber || "923001234567"
            }?text=Hi! I need help.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 font-body text-xs tracking-widest uppercase font-medium hover:bg-[#20b858] transition-colors"
          >
            <MessageCircle size={16} /> Chat on WhatsApp Now
          </a>
        </div>
      </div>
    </div>
  );
}
