/*
  Warnings:

  - You are about to drop the column `userId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceID` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tableId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reservation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservationId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservationId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Made the column `reservationId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_invoiceID_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_reservationId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_tableId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `userId`,
    ADD COLUMN `reservationId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `invoiceID`,
    DROP COLUMN `tableId`,
    DROP COLUMN `userId`,
    MODIFY `reservationId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Reservation` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_reservationId_key` ON `Invoice`(`reservationId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
