import { EmptyState } from "@/components/ui";
import { ButtonLink } from "@/components/ui";

export default function ReportThanksPage() {
  return (
    <main className="px-5 py-8">
      <EmptyState
        title="Thanks — we've got it"
        body="Our team reviews every report. You won't see this profile in your feeds."
        action={<ButtonLink href="/notifications">Back to Notifications</ButtonLink>}
      />
    </main>
  );
}
