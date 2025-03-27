-- CreateTable
CREATE TABLE `_UserPacks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserPacks_AB_unique`(`A`, `B`),
    INDEX `_UserPacks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserPacks` ADD CONSTRAINT `_UserPacks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pack`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserPacks` ADD CONSTRAINT `_UserPacks_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
