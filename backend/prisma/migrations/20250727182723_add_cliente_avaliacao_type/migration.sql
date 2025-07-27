-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'CLIENTE_AVALIACAO',
    "empresaId" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usuarios" ("created_at", "email", "empresaId", "id", "nome", "senha", "tipo", "updated_at") SELECT "created_at", "email", "empresaId", "id", "nome", "senha", "tipo", "updated_at" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
