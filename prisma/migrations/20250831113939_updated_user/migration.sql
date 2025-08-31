/*
  Warnings:

  - You are about to drop the column `ImageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "ImageUrl",
ADD COLUMN     "imageUrl" TEXT;
