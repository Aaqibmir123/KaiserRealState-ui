import { SoldTimeline } from "@/components/site/sold-timeline";
import { SectionHeading } from "@/components/common/section-heading";
import { getSoldRecords } from "@/backend/repositories/sold";

export default async function SoldPage() {
  const soldRecords = await getSoldRecords();

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 px-5 py-12 md:px-10 md:py-16">
      <SectionHeading
        eyebrow="Sold records"
        title="Recent sale history"
        description="Public sold records create confidence and show that the business is active in the market."
      />
      {soldRecords.length ? (
        <SoldTimeline soldRecords={soldRecords} />
      ) : (
        <div className="rounded-sm border border-forest-900/10 bg-white p-6 text-sm text-foreground/65">
          Sold records will appear here after live entries are added.
        </div>
      )}
    </div>
  );
}
