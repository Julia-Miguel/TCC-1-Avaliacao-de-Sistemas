/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Resposta` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `usuAvalId` to the `Resposta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFinalizado` to the `USUAval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `USUAval` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuAvalId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "resposta" TEXT NOT NULL,
    CONSTRAINT "Resposta_usuAvalId_fkey" FOREIGN KEY ("usuAvalId") REFERENCES "USUAval" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Resposta" ("id", "perguntaId", "resposta") SELECT "id", "perguntaId", "resposta" FROM "Resposta";
DROP TABLE "Resposta";
ALTER TABLE "new_Resposta" RENAME TO "Resposta";
CREATE TABLE "new_USUAval" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "avaliacaoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "isFinalizado" BOOLEAN NOT NULL,
    CONSTRAINT "USUAval_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "USUAval_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "Avaliacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_USUAval" ("avaliacaoId", "id", "usuarioId") SELECT "avaliacaoId", "id", "usuarioId" FROM "USUAval";
DROP TABLE "USUAval";
ALTER TABLE "new_USUAval" RENAME TO "USUAval";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);
INSERT INTO "new_Usuario" ("email", "id", "tipo") SELECT "email", "id", "tipo" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
