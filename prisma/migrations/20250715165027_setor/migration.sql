-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_setorId_fkey";

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "setorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
