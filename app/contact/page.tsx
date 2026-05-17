import { ContactDetailsSection } from "@/components/site/contact-details-section";
import { SectionHeading } from "@/components/common/section-heading";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-none space-y-6 px-5 py-10 md:px-10 lg:px-14 md:py-12">
      <SectionHeading
        eyebrow="Contact"
        title="Direct owner communication"
        description="Contact details, Kupwara office location, and working hours are shown here with no extra form clutter."
      />
      <ContactDetailsSection />
    </div>
  );
}
