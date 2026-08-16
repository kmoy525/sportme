import { BottomNav } from "@/components/bottom-nav";
import { hasUnreadNotifications } from "@/lib/notifications";
import { requireProfile } from "@/lib/session";

/**
 * Every authenticated screen funnels through requireProfile, which enforces
 * signed in -> age/ToS confirmed -> onboarded.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireProfile();
  const hasNotificationBadge = await hasUnreadNotifications(profile.id);

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto min-h-dvh max-w-md pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <BottomNav hasNotificationBadge={hasNotificationBadge} />
    </div>
  );
}
