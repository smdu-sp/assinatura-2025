/*
  Warnings:

  - You are about to drop the column `ramal` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "ramal",
ADD COLUMN     "ramalGrupo" TEXT;

-- CreateTable
CREATE TABLE "gruporamais" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "ramal" TEXT NOT NULL,

    CONSTRAINT "gruporamais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gruporamais_usuario_key" ON "gruporamais"("usuario");
