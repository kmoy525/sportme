-- Sport-specific matching fields for running, tennis, lifting, plus a shared
-- free-text description field on sport_profiles.

-- CreateEnum
CREATE TYPE "RunningRaceDistance" AS ENUM ('five_k', 'ten_k', 'half_marathon', 'marathon', 'ultra_marathon');

-- CreateEnum
CREATE TYPE "RunningTypicalDistance" AS ENUM ('one_mile', 'five_k', 'ten_k', 'ten_miles_plus');

-- CreateEnum
CREATE TYPE "TennisStyle" AS ENUM ('competitive', 'social');

-- CreateEnum
CREATE TYPE "TennisPreference" AS ENUM ('singles', 'doubles', 'both');

-- CreateEnum
CREATE TYPE "LiftingProgram" AS ENUM ('general_strength', 'powerlifting', 'bodybuilding', 'calisthenics', 'crossfit');

-- CreateEnum
CREATE TYPE "LiftingGoal" AS ENUM ('strength', 'fat_loss', 'competition_prep', 'general_fitness');

-- CreateEnum
CREATE TYPE "SessionLength" AS ENUM ('min_20', 'min_30', 'min_45', 'hr_1', 'hr_1_5', 'hr_2_plus');

-- CreateEnum
CREATE TYPE "GymMembership" AS ENUM ('twenty_four_hour_fitness', 'planet_fitness', 'ymca', 'healthworks', 'equinox', 'lifetime', 'other');

-- AlterTable
ALTER TABLE "sport_profiles" ADD COLUMN "description" TEXT;

-- CreateTable
CREATE TABLE "sport_profile_running" (
    "sport_profile_id" TEXT NOT NULL,
    "pace_seconds_per_mile" INTEGER,
    "training_for" "RunningRaceDistance",
    "typical_distance" "RunningTypicalDistance",

    CONSTRAINT "sport_profile_running_pkey" PRIMARY KEY ("sport_profile_id")
);

-- CreateTable
CREATE TABLE "sport_profile_tennis" (
    "sport_profile_id" TEXT NOT NULL,
    "ntrp" DOUBLE PRECISION,
    "style" "TennisStyle",
    "preference" "TennisPreference",

    CONSTRAINT "sport_profile_tennis_pkey" PRIMARY KEY ("sport_profile_id")
);

-- CreateTable
CREATE TABLE "sport_profile_lifting" (
    "sport_profile_id" TEXT NOT NULL,
    "program" "LiftingProgram",
    "goal" "LiftingGoal",
    "session_length" "SessionLength",
    "gym_membership" "GymMembership",

    CONSTRAINT "sport_profile_lifting_pkey" PRIMARY KEY ("sport_profile_id")
);

-- AddForeignKey
ALTER TABLE "sport_profile_running" ADD CONSTRAINT "sport_profile_running_sport_profile_id_fkey" FOREIGN KEY ("sport_profile_id") REFERENCES "sport_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_profile_tennis" ADD CONSTRAINT "sport_profile_tennis_sport_profile_id_fkey" FOREIGN KEY ("sport_profile_id") REFERENCES "sport_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_profile_lifting" ADD CONSTRAINT "sport_profile_lifting_sport_profile_id_fkey" FOREIGN KEY ("sport_profile_id") REFERENCES "sport_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
