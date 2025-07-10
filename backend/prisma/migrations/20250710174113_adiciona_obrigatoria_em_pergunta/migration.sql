-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "tipos" TEXT NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Pergunta" ("created_at", "enunciado", "id", "ordem", "tipos", "updated_at") SELECT "created_at", "enunciado", "id", "ordem", "tipos", "updated_at" FROM "Pergunta";
DROP TABLE "Pergunta";
ALTER TABLE "new_Pergunta" RENAME TO "Pergunta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
