-- Notifications nav badge: track when the tab was last viewed, and per-chat
-- read state per side.

-- AlterTable: profiles — add notifications_viewed_at
ALTER TABLE "profiles" ADD COLUMN "notifications_viewed_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "chat_reads" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_reads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_reads_chat_id_profile_id_key" ON "chat_reads"("chat_id", "profile_id");

-- AddForeignKey
ALTER TABLE "chat_reads" ADD CONSTRAINT "chat_reads_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_reads" ADD CONSTRAINT "chat_reads_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
