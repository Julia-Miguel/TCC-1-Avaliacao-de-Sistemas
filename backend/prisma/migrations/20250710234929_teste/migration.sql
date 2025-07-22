-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_que_perg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionarioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "que_perg_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "que_perg_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_que_perg" ("created_at", "id", "perguntaId", "questionarioId", "updated_at") SELECT "created_at", "id", "perguntaId", "questionarioId", "updated_at" FROM "que_perg";
DROP TABLE "que_perg";
ALTER TABLE "new_que_perg" RENAME TO "que_perg";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
