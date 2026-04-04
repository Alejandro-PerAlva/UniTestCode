/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Exercise` table. All the data in the column will be lost.
  - Made the column `description` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "teacherCode" TEXT
);
INSERT INTO "new_Exercise" ("description", "id", "title") SELECT "description", "id", "title" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
