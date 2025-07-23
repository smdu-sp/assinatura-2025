// src/lib/setoresService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSetores() {
  try {
    const setores = await prisma.setor.findMany();
    return setores;
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
