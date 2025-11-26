/*
  Warnings:

  - You are about to drop the column `data` on the `movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `movements` DROP COLUMN `data`,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
