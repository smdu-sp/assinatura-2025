/*
  Warnings:

  - You are about to drop the column `ramal` on the `gruporamais` table. All the data in the column will be lost.
  - You are about to drop the column `ramalGrupo` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `ramalGrupo` to the `gruporamais` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gruporamais" DROP COLUMN "ramal",
ADD COLUMN     "ramalGrupo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "ramalGrupo",
ADD COLUMN     "ramal" TEXT;
