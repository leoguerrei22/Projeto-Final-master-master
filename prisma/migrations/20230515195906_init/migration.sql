/*
  Warnings:

  - You are about to drop the column `valorPorPessoa` on the `fatura` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `fatura` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fatura` DROP COLUMN `valorPorPessoa`,
    DROP COLUMN `valorTotal`;

-- AlterTable
ALTER TABLE `produto` ADD COLUMN `preco` DOUBLE NOT NULL DEFAULT 0;
