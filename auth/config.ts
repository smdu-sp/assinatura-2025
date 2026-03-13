/** @format */

import { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				login: {},
				senha: {},
			},
			authorize: async (credentials) => {
				const { login, senha } = credentials;
				if (!login || !senha) return null;
				const resposta = await fetch(
					`${process.env.BASE_URL || 'http://localhost:3000'}/api/autenticar`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							login: login as string,
							senha: senha as string,
						}),
					},
				);
				if (resposta.status !== 200) {
					const data = await resposta.json();
					const erro = new CredentialsSignin();
					erro.code = data.erro ?? 'Credenciais inválidas.';
					throw erro;
				}
				const usuario = await resposta.json();
				if (!usuario) return null;
				return {
					id: usuario.id,
					email: usuario.email,
					nome: usuario.nome,
					login: usuario.login,
					telefone: usuario.telefone,
					permissao: usuario.permissao,
				};
			},
		}),
	],
	callbacks: {
		// @eslint-disable-next-line
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.nome = user.nome;
				token.login = user.login;
				token.telefone = user.telefone;
				token.permissao = user.permissao;
			}
			return token;
		},
		// @eslint-disable-next-line
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async session({ session, token }: any) {
			session.user.id = token.id;
			session.user.email = token.email;
			session.user.nome = token.nome;
			session.user.login = token.login;
			session.user.telefone = token.telefone;
			session.user.permissao = token.permissao;
			return session;
		},
	},
	pages: {
		signIn: '/auth/login',
		error: '/auth/login',
	},
	trustHost: true,
};
