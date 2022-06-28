-- AlterTable
ALTER TABLE "FlashCard" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_Reads" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Reads_AB_unique" ON "_Reads"("A", "B");

-- CreateIndex
CREATE INDEX "_Reads_B_index" ON "_Reads"("B");

-- AddForeignKey
ALTER TABLE "_Reads" ADD FOREIGN KEY ("A") REFERENCES "FlashCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reads" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
