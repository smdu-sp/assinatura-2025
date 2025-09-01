// src/app/api/setores/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCargos } from '@/services/cargos';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const setores = await getCargos();
    return NextResponse.json(setores);
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    return NextResponse.json({ error: "Erro ao buscar cargos" }, { status: 500 });
  }
}
