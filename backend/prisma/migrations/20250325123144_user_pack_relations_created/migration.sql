/*
  Warnings:

  - You are about to drop the `_packtouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_packtouser` DROP FOREIGN KEY `_PackToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_packtouser` DROP FOREIGN KEY `_PackToUser_B_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `classes_remaining` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `current_pack_id` INTEGER NULL,
    ADD COLUMN `pack_expiration_date` DATETIME(3) NULL;

-- DropTable
DROP TABLE `_packtouser`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_current_pack_id_fkey` FOREIGN KEY (`current_pack_id`) REFERENCES `Pack`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
