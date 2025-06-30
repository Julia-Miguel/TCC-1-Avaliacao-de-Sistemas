/*
  Warnings:

  - You are about to drop the `pergunta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pergunta";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "tipos" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_opcoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    CONSTRAINT "opcoes_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_opcoes" ("id", "perguntaId", "texto") SELECT "id", "perguntaId", "texto" FROM "opcoes";
DROP TABLE "opcoes";
ALTER TABLE "new_opcoes" RENAME TO "opcoes";
CREATE TABLE "new_que_perg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionarioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "que_perg_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "que_perg_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_que_perg" ("created_at", "id", "perguntaId", "questionarioId", "updated_at") SELECT "created_at", "id", "perguntaId", "questionarioId", "updated_at" FROM "que_perg";
DROP TABLE "que_perg";
ALTER TABLE "new_que_perg" RENAME TO "que_perg";
CREATE TABLE "new_resposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuAvalId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "resposta" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "resposta_usuAvalId_fkey" FOREIGN KEY ("usuAvalId") REFERENCES "usu_aval" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_resposta" ("created_at", "id", "perguntaId", "resposta", "updated_at", "usuAvalId") SELECT "created_at", "id", "perguntaId", "resposta", "updated_at", "usuAvalId" FROM "resposta";
DROP TABLE "resposta";
ALTER TABLE "new_resposta" RENAME TO "resposta";
CREATE UNIQUE INDEX "resposta_usuAvalId_perguntaId_key" ON "resposta"("usuAvalId", "perguntaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
