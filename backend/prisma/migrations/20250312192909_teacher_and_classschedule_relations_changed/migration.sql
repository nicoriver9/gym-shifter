-- DropForeignKey
ALTER TABLE `classschedule` DROP FOREIGN KEY `ClassSchedule_teacher_id_fkey`;

-- DropIndex
DROP INDEX `ClassSchedule_teacher_id_fkey` ON `classschedule`;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
