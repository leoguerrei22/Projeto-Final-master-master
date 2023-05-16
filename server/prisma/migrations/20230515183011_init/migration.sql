/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utilizadorrole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `utilizadorrole` DROP FOREIGN KEY `UtilizadorRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `utilizadorrole` DROP FOREIGN KEY `UtilizadorRole_utilizadorId_fkey`;

-- AlterTable
ALTER TABLE `utilizador` ADD COLUMN `role` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `utilizadorrole`;
