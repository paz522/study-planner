-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudyItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "progress" REAL NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "StudyItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StudyItem" ("createdAt", "description", "dueDate", "id", "priority", "progress", "title", "updatedAt", "userId") SELECT "createdAt", "description", "dueDate", "id", "priority", "progress", "title", "updatedAt", "userId" FROM "StudyItem";
DROP TABLE "StudyItem";
ALTER TABLE "new_StudyItem" RENAME TO "StudyItem";
CREATE TABLE "new_StudySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "studyItemId" TEXT NOT NULL,
    CONSTRAINT "StudySession_studyItemId_fkey" FOREIGN KEY ("studyItemId") REFERENCES "StudyItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StudySession" ("completed", "createdAt", "endTime", "id", "notes", "startTime", "studyItemId", "updatedAt", "userId") SELECT "completed", "createdAt", "endTime", "id", "notes", "startTime", "studyItemId", "updatedAt", "userId" FROM "StudySession";
DROP TABLE "StudySession";
ALTER TABLE "new_StudySession" RENAME TO "StudySession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
