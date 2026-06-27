"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  const number = settings?.brand?.whatsappNumber || "923001234567";

  return (
    <a
      href={`https://wa.me/${number}?text=Hi! I need help with Libaas-e-Farda.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
      <span className="absolute right-16 bg-charcoal text-ivory-100 text-xs font-body px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        Chat with us
      </span>
    </a>
  );
}
