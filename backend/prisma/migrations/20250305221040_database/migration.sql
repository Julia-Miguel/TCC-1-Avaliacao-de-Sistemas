/*
  Warnings:

  - You are about to drop the `Avaliacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pergunta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuePerg` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resposta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USUAval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `questionarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Resposta_usuAvalId_perguntaId_key";

-- DropIndex
DROP INDEX "Usuario_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Avaliacao";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Pergunta";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuePerg";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Resposta";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "USUAval";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Usuario";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "usu_aval" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "avaliacaoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "isFinalizado" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "usu_aval_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usu_aval_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "avaliacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuAvalId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "resposta" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "resposta_usuAvalId_fkey" FOREIGN KEY ("usuAvalId") REFERENCES "usu_aval" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semestre" TEXT NOT NULL,
    "questionarioId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "avaliacao_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "que_perg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionarioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "que_perg_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "que_perg_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "tipos" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_questionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_questionarios" ("id", "titulo") SELECT "id", "titulo" FROM "questionarios";
DROP TABLE "questionarios";
ALTER TABLE "new_questionarios" RENAME TO "questionarios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "resposta_usuAvalId_perguntaId_key" ON "resposta"("usuAvalId", "perguntaId");
