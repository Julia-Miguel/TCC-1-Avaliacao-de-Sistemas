-- CreateTable
CREATE TABLE "opcoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    CONSTRAINT "opcoes_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "tipos" TEXT NOT NULL DEFAULT 'TEXTO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_pergunta" ("created_at", "enunciado", "id", "tipos", "updated_at") SELECT "created_at", "enunciado", "id", "tipos", "updated_at" FROM "pergunta";
DROP TABLE "pergunta";
ALTER TABLE "new_pergunta" RENAME TO "pergunta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
