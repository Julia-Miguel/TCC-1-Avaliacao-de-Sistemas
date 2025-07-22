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
    CONSTRAINT "avaliacao_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_avaliacao" ("created_at", "criadorId", "id", "questionarioId", "requerLoginCliente", "semestre", "updated_at") SELECT "created_at", "criadorId", "id", "questionarioId", "requerLoginCliente", "semestre", "updated_at" FROM "avaliacao";
DROP TABLE "avaliacao";
ALTER TABLE "new_avaliacao" RENAME TO "avaliacao";
CREATE TABLE "new_que_perg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionarioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "que_perg_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "questionarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "que_perg_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT "resposta_usuAvalId_fkey" FOREIGN KEY ("usuAvalId") REFERENCES "usu_aval" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_resposta" ("created_at", "id", "perguntaId", "resposta", "updated_at", "usuAvalId") SELECT "created_at", "id", "perguntaId", "resposta", "updated_at", "usuAvalId" FROM "resposta";
DROP TABLE "resposta";
ALTER TABLE "new_resposta" RENAME TO "resposta";
CREATE UNIQUE INDEX "resposta_usuAvalId_perguntaId_key" ON "resposta"("usuAvalId", "perguntaId");
CREATE TABLE "new_usu_aval" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "avaliacaoId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "anonymousSessionId" TEXT,
    "status" TEXT NOT NULL,
    "isFinalizado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "usu_aval_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "avaliacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "usu_aval_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usu_aval" ("anonymousSessionId", "avaliacaoId", "created_at", "id", "isFinalizado", "status", "updated_at", "usuarioId") SELECT "anonymousSessionId", "avaliacaoId", "created_at", "id", "isFinalizado", "status", "updated_at", "usuarioId" FROM "usu_aval";
DROP TABLE "usu_aval";
ALTER TABLE "new_usu_aval" RENAME TO "usu_aval";
CREATE UNIQUE INDEX "usu_aval_avaliacaoId_usuarioId_key" ON "usu_aval"("avaliacaoId", "usuarioId");
CREATE UNIQUE INDEX "usu_aval_avaliacaoId_anonymousSessionId_key" ON "usu_aval"("avaliacaoId", "anonymousSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
