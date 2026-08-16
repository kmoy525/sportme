import Link from "next/link";

import { ChevronRightIcon } from "@/components/icons";
import { ProfilePhoto } from "@/components/profile-card";
import { Badge, Card, EmptyState, SectionHeading } from "@/components/ui";
import { getIncomingLikes, getPartners } from "@/lib/notifications";
import { requireProfile } from "@/lib/session";
import { sportLabel } from "@/lib/sports";

export const metadata = { title: "Notifications · TrainWithMe" };

export default async function NotificationsPage() {
  const { profile } = await requireProfile();

  const [incoming, partners] = await Promise.all([
    getIncomingLikes(profile.id),
    getPartners(profile.id),
  ]);

  return (
    <>
      <header className="bg-turf px-5 pb-5 pt-6">
        <h1 className="display text-3xl text-chalk">Notifications</h1>
      </header>

      <main className="space-y-7 px-5 py-5">
        <section>
          <SectionHeading>Wants to train with you</SectionHeading>

          {incoming.length === 0 ? (
            <EmptyState
              title="Nothing new yet"
              body="When someone wants to train with you, they'll show up here."
            />
          ) : (
            <ul className="space-y-2">
              {incoming.map((person) => (
                <li key={person.profileId}>
                  <Link href={`/notifications/${person.profileId}`} className="block">
                    <Card className="flex items-center gap-3 px-3 py-3 transition-colors hover:border-turf/40">
                      <ProfilePhoto
                        photoUrl={person.photoUrl}
                        name={person.name}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-ink">
                          {person.name} wants to train with you
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {person.sports.map((sport) => (
                            <Badge key={sport}>{sportLabel(sport)}</Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionHeading>Training Partners</SectionHeading>

          {partners.length === 0 ? (
            <EmptyState
              title="No partners yet"
              body="Thumbs up someone who's already thumbed you up and you'll match."
            />
          ) : (
            <ul className="space-y-2">
              {partners.map((partner) => (
                <li key={partner.profileId}>
                  <Link
                    href={
                      partner.chatId
                        ? `/chats/${partner.chatId}`
                        : `/partners/${partner.profileId}`
                    }
                    className="block"
                  >
                    <Card className="flex items-center gap-3 px-3 py-3 transition-colors hover:border-turf/40">
                      <ProfilePhoto
                        photoUrl={partner.photoUrl}
                        name={partner.name}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[15px] font-semibold text-ink">
                            {partner.name}
                          </p>
                          {partner.sports.map((sport) => (
                            <Badge key={sport} tone="muted">
                              {sportLabel(sport)}
                            </Badge>
                          ))}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-ink/55">
                          {partner.lastMessage
                            ? `${partner.lastMessage.fromViewer ? "You: " : ""}${partner.lastMessage.content}`
                            : "Say hi →"}
                        </p>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
