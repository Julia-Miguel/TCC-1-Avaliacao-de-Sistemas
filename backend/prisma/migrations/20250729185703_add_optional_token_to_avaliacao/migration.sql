/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `avaliacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "avaliacao" ADD COLUMN "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_token_key" ON "avaliacao"("token");
