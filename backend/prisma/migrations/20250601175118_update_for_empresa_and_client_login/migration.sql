/*
  Warnings:

  - Added the required column `criadorId` to the `avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criadorId` to the `questionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "empresas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "emailResponsavel" TEXT NOT NULL,
    "senhaEmpresa" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semestre" TEXT NOT NULL,
    "requerLoginCliente" BOOLEAN NOT NULL DEFAULT false,
    "questionarioId" INTEGER NOT NULL,
    "criadorId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "avaliacao_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_avaliacao" ("created_at", "id", "questionarioId", "semestre", "updated_at") SELECT "created_at", "id", "questionarioId", "semestre", "updated_at" FROM "avaliacao";
DROP TABLE "avaliacao";
ALTER TABLE "new_avaliacao" RENAME TO "avaliacao";
CREATE TABLE "new_questionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "criadorId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "questionarios_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_questionarios" ("created_at", "id", "titulo", "updated_at") SELECT "created_at", "id", "titulo", "updated_at" FROM "questionarios";
DROP TABLE "questionarios";
ALTER TABLE "new_questionarios" RENAME TO "questionarios";
CREATE TABLE "new_usu_aval" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "avaliacaoId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "anonymousSessionId" TEXT,
    "status" TEXT NOT NULL,
    "isFinalizado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "usu_aval_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "avaliacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usu_aval_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usu_aval" ("avaliacaoId", "created_at", "id", "isFinalizado", "status", "updated_at", "usuarioId") SELECT "avaliacaoId", "created_at", "id", "isFinalizado", "status", "updated_at", "usuarioId" FROM "usu_aval";
DROP TABLE "usu_aval";
ALTER TABLE "new_usu_aval" RENAME TO "usu_aval";
CREATE UNIQUE INDEX "usu_aval_anonymousSessionId_key" ON "usu_aval"("anonymousSessionId");
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "empresaId" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usuarios" ("created_at", "email", "id", "nome", "tipo", "updated_at") SELECT "created_at", "email", "id", "nome", "tipo", "updated_at" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nome_key" ON "empresas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_emailResponsavel_key" ON "empresas"("emailResponsavel");
