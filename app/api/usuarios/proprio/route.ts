import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { se } from 'date-fns/locale';

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ status: 401, error: "Usuário nao autenticado." });
  }
  try {
    const { unidade, cargo, telefone, aniversario, email } = await req.json();
    console.log(email)
    // Basic validation
    if (!unidade) {
      return NextResponse.json({ status: 400, error: "Unidade é obrigatória." });
    }
    if (!cargo) {
      return NextResponse.json({ status: 400, error: "Cargo é obrigatório." });
    }
    if (!telefone) {
      return NextResponse.json({ status: 400, error: "Telefone é obrigatório." });
    }
    if (!aniversario) {
      return NextResponse.json({ status: 400, error: "Aniversário é obrigatório." });
    }
    if (!email) {
      return NextResponse.json({ status: 400, error: "Email é obrigatório para identificar o usuário." });
    }

    if (!prisma) {
      return NextResponse.json({ status: 500, error: "Erro interno do servidor: Cliente Prisma não inicializado." });
    }

    const updateUser = await prisma.usuario.update({
      where: { id: session.user.id },
      data: {
        setorId: unidade,
        cargo: cargo,
        telefone: telefone,
        aniversario: aniversario
      }
    });

    if (!updateUser) {
      return NextResponse.json({
        status: 404,
        error: "Não foi possível atualizar o cadastro. Verifique se o e-mail está correto ou se o usuário existe."
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Cadastro atualizado com sucesso!",
      updateUser
    });
  } catch (error) {
    console.error("Erro na API de atualização de usuário:", error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json({ status: 400, error: "Corpo da requisição inválido. Esperado JSON." });
    }
    return NextResponse.json({
      status: 500,
      error: "Ocorreu um erro inesperado ao processar sua solicitação."
    });
  }
}