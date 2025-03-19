/*
  Warnings:

  - You are about to drop the `Questionario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuAvalId,perguntaId]` on the table `Resposta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipos` to the `Pergunta` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Questionario";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "questionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semestre" TEXT NOT NULL,
    "questionarioId" INTEGER NOT NULL,
    CONSTRAINT "Avaliacao_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Avaliacao" ("id", "questionarioId", "semestre") SELECT "id", "questionarioId", "semestre" FROM "Avaliacao";
DROP TABLE "Avaliacao";
ALTER TABLE "new_Avaliacao" RENAME TO "Avaliacao";
CREATE TABLE "new_Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "tipos" TEXT NOT NULL
);
INSERT INTO "new_Pergunta" ("enunciado", "id") SELECT "enunciado", "id" FROM "Pergunta";
DROP TABLE "Pergunta";
ALTER TABLE "new_Pergunta" RENAME TO "Pergunta";
CREATE TABLE "new_QuePerg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionarioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    CONSTRAINT "QuePerg_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuePerg_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuePerg" ("id", "perguntaId", "questionarioId") SELECT "id", "perguntaId", "questionarioId" FROM "QuePerg";
DROP TABLE "QuePerg";
ALTER TABLE "new_QuePerg" RENAME TO "QuePerg";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_usuAvalId_perguntaId_key" ON "Resposta"("usuAvalId", "perguntaId");
