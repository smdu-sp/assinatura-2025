import { db } from "@/lib/prisma";

export async function getCargos() {
  try {
    const cargos = await db.cargo.findMany({
      orderBy: { nome: "asc" },
    });
    return cargos;
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    return [];
  }
}
