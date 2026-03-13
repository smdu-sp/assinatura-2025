/** @format */

import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { login, senha } = await req.json();
	if (!login || !senha)
		return NextResponse.json({ erro: 'Login e senha são obrigatórios.' }, { status: 400 });
	let usuario = await db.usuario.findUnique({ where: { login } });
	if (!usuario) {
		const resposta = await fetch(`${process.env.SMUL_AUTH_URL}/ldap/buscar-por-login/${login}?secretarias=SMUL`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		if (!resposta.ok) return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
		const buscaUsuario = await resposta.json();
		if (!buscaUsuario) return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
		const { nome, email, telefone } = buscaUsuario;
		const novoUsuario = await db.usuario.create({ data: { login, nome, email, telefone: telefone || '' }  });
		if (!novoUsuario) return NextResponse.json({ erro: 'Erro ao criar usuário.' }, { status: 500 });
		usuario = novoUsuario;
	}
	const resposta = await fetch(`${process.env.SMUL_AUTH_URL}/ldap/autenticar`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ login, senha }),
	});
	if (!resposta.ok) return NextResponse.json({ erro: 'Credenciais inválidas.' }, { status: 401 });
	return NextResponse.json(usuario);
}