/*
  Warnings:

  - Added the required column `lat` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "isVisited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
