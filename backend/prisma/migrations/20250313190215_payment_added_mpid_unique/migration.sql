/*
  Warnings:

  - A unique constraint covering the columns `[mercadoPagoId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Payment_mercadoPagoId_key` ON `Payment`(`mercadoPagoId`);
