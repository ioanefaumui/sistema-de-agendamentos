/*
  Warnings:

  - Added the required column `endTime` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL
);
INSERT INTO "new_Service" ("duration", "id", "name", "price") SELECT "duration", "id", "name", "price" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
