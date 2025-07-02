-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `reservation_date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `role` ENUM('Admin', 'User', 'Instructor') NOT NULL DEFAULT 'User';
