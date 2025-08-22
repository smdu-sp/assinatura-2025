// src/app/api/setores/route.ts
import { NextResponse } from 'next/server';
import { getSetores } from '@/lib/setoresService';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const setores = await getSetores();
    return NextResponse.json(setores);
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    return NextResponse.json({ error: "Erro ao buscar setores" }, { status: 500 });
  }
}
