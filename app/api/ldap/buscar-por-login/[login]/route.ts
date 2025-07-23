import { buscarPorLoginOuNome } from "@/services/ldap";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ login: string }> }
) {
  const { login } = await params
  if (!login || login === "") return NextResponse.json({
    status: 400,
    error: "Login é obrigatório!"
  })
  try {
    const resposta = await buscarPorLoginOuNome(login, login);
    if (!resposta) return NextResponse.json({
        status: 404,
        error: "Usuário não encontrado"
    })
    return NextResponse.json({
        status: 200,
        data: resposta
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({
        status: 500,
        error: "Usuário não encontrado"
    })
  }
}