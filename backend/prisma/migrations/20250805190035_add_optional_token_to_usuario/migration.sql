/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_token_key" ON "usuarios"("token");
