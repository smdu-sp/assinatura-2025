// src/app/api/setores/route.ts
import { NextResponse } from 'next/server';
import { getSetores } from '@/lib/setoresService';

export async function GET() {
  try {
    const setores = await getSetores();
    return NextResponse.json(setores);
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    return NextResponse.json({ error: "Erro ao buscar setores" }, { status: 500 });
  }
}
