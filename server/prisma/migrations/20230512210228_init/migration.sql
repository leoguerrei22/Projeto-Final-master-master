-- CreateTable
CREATE TABLE `Utilizador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(255) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Utilizador_email_key`(`email`),
    INDEX `Utilizador_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UtilizadorRole` (
    `utilizadorId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`utilizadorId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `utilizadorId` INTEGER NOT NULL,
    `mesa` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `observacoes` VARCHAR(255) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mesa` INTEGER NOT NULL,
    `utilizadorId` INTEGER NOT NULL,
    `reservaId` INTEGER NOT NULL,
    `observacoes` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pendente',
    `faturaID` INTEGER NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `categoria` VARCHAR(255) NOT NULL,
    `observacoes` VARCHAR(255) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'indisponivel',
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilizadorId` INTEGER NOT NULL,
    `documentoParaFatura` VARCHAR(255) NULL,
    `formaPagamento` VARCHAR(255) NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `valorPorPessoa` DOUBLE NOT NULL,
    `observacoes` VARCHAR(255) NULL,
    `statusPagamento` VARCHAR(191) NOT NULL DEFAULT 'pendente',
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PedidoToProduto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PedidoToProduto_AB_unique`(`A`, `B`),
    INDEX `_PedidoToProduto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UtilizadorRole` ADD CONSTRAINT `UtilizadorRole_utilizadorId_fkey` FOREIGN KEY (`utilizadorId`) REFERENCES `Utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtilizadorRole` ADD CONSTRAINT `UtilizadorRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_utilizadorId_fkey` FOREIGN KEY (`utilizadorId`) REFERENCES `Utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_utilizadorId_fkey` FOREIGN KEY (`utilizadorId`) REFERENCES `Utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `Reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_faturaID_fkey` FOREIGN KEY (`faturaID`) REFERENCES `Fatura`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fatura` ADD CONSTRAINT `Fatura_utilizadorId_fkey` FOREIGN KEY (`utilizadorId`) REFERENCES `Utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PedidoToProduto` ADD CONSTRAINT `_PedidoToProduto_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PedidoToProduto` ADD CONSTRAINT `_PedidoToProduto_B_fkey` FOREIGN KEY (`B`) REFERENCES `Produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
