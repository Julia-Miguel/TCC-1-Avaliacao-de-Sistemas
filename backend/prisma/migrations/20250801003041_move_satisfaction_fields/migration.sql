/*
  Warnings:

  - You are about to drop the column `ativo` on the `avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `eh_satisfacao` on the `avaliacao` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "semestre" TEXT NOT NULL,
    "requerLoginCliente" BOOLEAN NOT NULL DEFAULT false,
    "questionarioId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "criadorId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "avaliacao_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_avaliacao" ("created_at", "criadorId", "id", "questionarioId", "requerLoginCliente", "semestre", "token", "updated_at") SELECT "created_at", "criadorId", "id", "questionarioId", "requerLoginCliente", "semestre", "token", "updated_at" FROM "avaliacao";
DROP TABLE "avaliacao";
ALTER TABLE "new_avaliacao" RENAME TO "avaliacao";
CREATE UNIQUE INDEX "avaliacao_token_key" ON "avaliacao"("token");
CREATE TABLE "new_questionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "criadorId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "eh_satisfacao" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "questionarios_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_questionarios" ("created_at", "criadorId", "id", "ordem", "titulo", "updated_at") SELECT "created_at", "criadorId", "id", "ordem", "titulo", "updated_at" FROM "questionarios";
DROP TABLE "questionarios";
ALTER TABLE "new_questionarios" RENAME TO "questionarios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
