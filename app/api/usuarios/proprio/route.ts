import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    const { nome, unidade, cargo, telefone, aniversario, andar, ramal } =
      await req.json();

    if (!unidade) {
      return NextResponse.json(
        { error: "Unidade é obrigatória." },
        { status: 400 }
      );
    }
    if (!cargo) {
      return NextResponse.json(
        { error: "Cargo é obrigatório." },
        { status: 400 }
      );
    }
    if (!telefone) {
      return NextResponse.json(
        { error: "Telefone é obrigatório." },
        { status: 400 }
      );
    }
    if (!andar) {
      return NextResponse.json(
        { error: "Andar é obrigatório." },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Erro interno do servidor: Cliente Prisma não inicializado." },
        { status: 500 }
      );
    }

    const setorExistente = await db.setor.findUnique({
      where: { id: unidade },
    });

    if (!setorExistente) {
      return NextResponse.json(
        { error: "Unidade selecionada não encontrada." },
        { status: 400 }
      );
    }

    const updateData: {
      cargo: string;
      telefone: string;
      andar: string;
      setor: { connect: { id: string } };
      aniversario?: string;
      ramal?: string;
    } = {
      cargo: cargo,
      telefone: telefone,
      andar: andar,
      setor: {
        connect: {
          id: unidade,
        },
      },
    };

    if (aniversario) {
      updateData.aniversario = aniversario;
    }

    if (ramal) {
      updateData.ramal = ramal;
    }

    const updateUser = await db.usuario.update({
      where: { id: session.user.id },
      data: updateData,
    });

    if (!updateUser) {
      return NextResponse.json(
        {
          error:
            "Usuário não encontrado para atualização, ou dados inválidos fornecidos.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Cadastro atualizado com sucesso!",
        updateUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na API de atualização de usuário:", error);

    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          { error: "Usuário não encontrado." },
          { status: 404 }
        );
      }
      if (error.message.includes("Invalid `data` argument")) {
        return NextResponse.json(
          { error: "Dados fornecidos inválidos ou tipo incorreto." },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro interno do servidor ao processar sua solicitação.",
      },
      { status: 500 }
    );
  }
}
