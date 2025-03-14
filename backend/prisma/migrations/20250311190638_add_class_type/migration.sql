/*
  Warnings:

  - You are about to drop the column `class_name` on the `classschedule` table. All the data in the column will be lost.
  - Added the required column `class_type_id` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classschedule` DROP COLUMN `class_name`,
    ADD COLUMN `class_type_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ClassType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `ClassType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_class_type_id_fkey` FOREIGN KEY (`class_type_id`) REFERENCES `ClassType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
