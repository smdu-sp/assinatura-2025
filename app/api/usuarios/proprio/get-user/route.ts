// /api/usuarios/proprio/get-user/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !db) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    const usuario = await db.usuario.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        login: true,
        permissao: true,
        telefone: true,
        cargo: true,
        setorId: true,
        andar: true,
        aniversario: true,
        ramal: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const ramalDeGrupo = await db.grupoRamal.findUnique({
      where: { usuario: usuario.login },
      select: {
        ramalGrupo: true,
      },
    });

    // Se o ramal de grupo existir, use-o, senão use o ramal do usuário ou uma string vazia
    const ramalFinal = ramalDeGrupo
      ? ramalDeGrupo.ramalGrupo
      : usuario.ramal || "";

    const dadosCompletos = {
      ...usuario,
      ramal: ramalFinal,
    };
    
    return NextResponse.json(dadosCompletos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
