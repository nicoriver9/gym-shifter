-- AlterTable
ALTER TABLE `classschedule` MODIFY `teacher_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `pack_date` DATETIME(3) NULL;
