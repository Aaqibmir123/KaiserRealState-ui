import { MessageCircle } from "lucide-react";
import { site } from "@/constants/site";

export function FloatingWhatsApp() {
  const href = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_40px_rgba(37,211,102,0.35)] transition hover:scale-105"
      aria-label="WhatsApp inquiry"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
