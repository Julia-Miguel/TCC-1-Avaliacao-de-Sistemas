/*
  Warnings:

  - Made the column `token` on table `avaliacao` required. This step will fail if there are existing NULL values in that column.

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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
