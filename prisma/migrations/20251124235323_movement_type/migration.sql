/*
  Warnings:

  - Added the required column `type` to the `movements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movements` ADD COLUMN `type` ENUM('INCOME', 'EXPENSE') NOT NULL;
