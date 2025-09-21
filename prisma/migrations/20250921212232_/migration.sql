-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('active', 'finished', 'cooldown');

-- AlterTable
ALTER TABLE "public"."Round" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'cooldown';
