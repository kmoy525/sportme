-- SportMe update: drop preferred_contact, replace bjj weight/height with weight_class,
-- add event description.

-- CreateEnum
CREATE TYPE "WeightClass" AS ENUM ('rooster', 'light_feather', 'feather', 'light', 'middle', 'medium_heavy', 'heavy', 'super_heavy', 'ultra_heavy');

-- AlterTable: profiles — drop preferred_contact
ALTER TABLE "profiles" DROP COLUMN "preferred_contact";

-- DropEnum
DROP TYPE "PreferredContact";

-- AlterTable: sport_profile_bjj — drop height_in and weight, add weight_class
ALTER TABLE "sport_profile_bjj" DROP COLUMN "height_in";
ALTER TABLE "sport_profile_bjj" DROP COLUMN "weight";
ALTER TABLE "sport_profile_bjj" ADD COLUMN "weight_class" "WeightClass";

-- AlterTable: events — add description
ALTER TABLE "events" ADD COLUMN "description" TEXT;
