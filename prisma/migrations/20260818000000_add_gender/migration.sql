-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "gender" "Gender";

