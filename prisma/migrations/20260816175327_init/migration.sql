-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('bjj', 'running', 'tennis', 'lifting');

-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('18-24', '25-34', '35-44', '45-54', '55+');

-- CreateEnum
CREATE TYPE "Belt" AS ENUM ('white', 'blue', 'purple', 'brown', 'black');

-- CreateEnum
CREATE TYPE "PreferredContact" AS ENUM ('email', 'sms');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('credentials', 'google', 'apple');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('fake_profile', 'harassment', 'inappropriate_photo', 'other');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "auth_provider" "AuthProvider" NOT NULL,
    "password_hash" TEXT,
    "age_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "tos_accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age_range" "AgeRange" NOT NULL,
    "photo_url" TEXT,
    "zip_code" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "travel_radius_miles" INTEGER NOT NULL DEFAULT 25,
    "preferred_contact" "PreferredContact" NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sport_profiles" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "opted_into_matching" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sport_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sport_profile_bjj" (
    "sport_profile_id" TEXT NOT NULL,
    "weight" INTEGER,
    "height_in" INTEGER,
    "belt" "Belt" NOT NULL,
    "gym" TEXT,

    CONSTRAINT "sport_profile_bjj_pkey" PRIMARY KEY ("sport_profile_id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "from_profile_id" TEXT NOT NULL,
    "to_profile_id" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passes" (
    "id" TEXT NOT NULL,
    "from_profile_id" TEXT NOT NULL,
    "to_profile_id" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "profile_a_id" TEXT NOT NULL,
    "profile_b_id" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "blocker_profile_id" TEXT NOT NULL,
    "blocked_profile_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reporter_profile_id" TEXT NOT NULL,
    "reported_profile_id" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "notes" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_profile_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "sport" "Sport" NOT NULL,
    "name" TEXT NOT NULL,
    "location_text" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "event_date" DATE NOT NULL,
    "start_time" TEXT NOT NULL,
    "expected_size" TEXT,
    "rsvp_url" TEXT,
    "created_by_profile_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sport_requests" (
    "id" TEXT NOT NULL,
    "requested_sport_name" TEXT NOT NULL,
    "requester_profile_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sport_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_key" ON "accounts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_account_id_key" ON "profiles"("account_id");

-- CreateIndex
CREATE INDEX "profiles_hidden_idx" ON "profiles"("hidden");

-- CreateIndex
CREATE INDEX "sport_profiles_sport_opted_into_matching_idx" ON "sport_profiles"("sport", "opted_into_matching");

-- CreateIndex
CREATE UNIQUE INDEX "sport_profiles_profile_id_sport_key" ON "sport_profiles"("profile_id", "sport");

-- CreateIndex
CREATE INDEX "likes_to_profile_id_sport_idx" ON "likes"("to_profile_id", "sport");

-- CreateIndex
CREATE UNIQUE INDEX "likes_from_profile_id_to_profile_id_sport_key" ON "likes"("from_profile_id", "to_profile_id", "sport");

-- CreateIndex
CREATE UNIQUE INDEX "passes_from_profile_id_to_profile_id_sport_key" ON "passes"("from_profile_id", "to_profile_id", "sport");

-- CreateIndex
CREATE UNIQUE INDEX "matches_profile_a_id_profile_b_id_sport_key" ON "matches"("profile_a_id", "profile_b_id", "sport");

-- CreateIndex
CREATE INDEX "blocks_blocked_profile_id_idx" ON "blocks"("blocked_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_blocker_profile_id_blocked_profile_id_key" ON "blocks"("blocker_profile_id", "blocked_profile_id");

-- CreateIndex
CREATE INDEX "reports_reported_profile_id_idx" ON "reports"("reported_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_reporter_profile_id_reported_profile_id_key" ON "reports"("reporter_profile_id", "reported_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_match_id_key" ON "chats"("match_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "events_sport_event_date_idx" ON "events"("sport", "event_date");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_profiles" ADD CONSTRAINT "sport_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_profile_bjj" ADD CONSTRAINT "sport_profile_bjj_sport_profile_id_fkey" FOREIGN KEY ("sport_profile_id") REFERENCES "sport_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_from_profile_id_fkey" FOREIGN KEY ("from_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_to_profile_id_fkey" FOREIGN KEY ("to_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_from_profile_id_fkey" FOREIGN KEY ("from_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passes" ADD CONSTRAINT "passes_to_profile_id_fkey" FOREIGN KEY ("to_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_profile_a_id_fkey" FOREIGN KEY ("profile_a_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_profile_b_id_fkey" FOREIGN KEY ("profile_b_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocker_profile_id_fkey" FOREIGN KEY ("blocker_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocked_profile_id_fkey" FOREIGN KEY ("blocked_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_profile_id_fkey" FOREIGN KEY ("reporter_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_profile_id_fkey" FOREIGN KEY ("reported_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_profile_id_fkey" FOREIGN KEY ("sender_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_profile_id_fkey" FOREIGN KEY ("created_by_profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_requests" ADD CONSTRAINT "sport_requests_requester_profile_id_fkey" FOREIGN KEY ("requester_profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
