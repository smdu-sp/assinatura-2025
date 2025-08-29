import { db } from "@/lib/prisma";

export async function getSetores() {
  try {
    const setores = await db.setor.findMany({
      orderBy: { nome: "asc" },
    });
    return setores;
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    return [];
  }
}
