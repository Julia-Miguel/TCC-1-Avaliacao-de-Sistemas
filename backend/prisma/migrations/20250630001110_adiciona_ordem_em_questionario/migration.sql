-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_questionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "criadorId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "questionarios_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_questionarios" ("created_at", "criadorId", "id", "titulo", "updated_at") SELECT "created_at", "criadorId", "id", "titulo", "updated_at" FROM "questionarios";
DROP TABLE "questionarios";
ALTER TABLE "new_questionarios" RENAME TO "questionarios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
