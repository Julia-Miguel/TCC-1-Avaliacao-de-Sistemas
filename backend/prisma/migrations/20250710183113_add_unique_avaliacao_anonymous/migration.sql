/*
  Warnings:

  - A unique constraint covering the columns `[avaliacaoId,usuarioId]` on the table `usu_aval` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avaliacaoId,anonymousSessionId]` on the table `usu_aval` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "usu_aval_avaliacaoId_usuarioId_key" ON "usu_aval"("avaliacaoId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usu_aval_avaliacaoId_anonymousSessionId_key" ON "usu_aval"("avaliacaoId", "anonymousSessionId");
