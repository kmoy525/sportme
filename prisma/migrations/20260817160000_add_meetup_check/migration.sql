-- CreateTable
CREATE TABLE "meetup_checks" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "worked_out" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meetup_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meetup_checks_chat_id_key" ON "meetup_checks"("chat_id");

-- AddForeignKey
ALTER TABLE "meetup_checks" ADD CONSTRAINT "meetup_checks_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

