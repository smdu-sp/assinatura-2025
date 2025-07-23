/** @format */

import 'server-only';
import { db } from '@/lib/prisma';
import { Client as LdapClient } from 'ldapts';

const ldap = new LdapClient({
	url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
});

async function bind(login: string, senha: string) {
	let usuario = await db.usuario.findUnique({ where: { login } });
	if (!usuario) {
		const buscaUsuario = await buscarPorLogin(login);
		console.log(buscaUsuario);
		if (!buscaUsuario) return null;
		const novoUsuario = await db.usuario.create({ data: buscaUsuario });
		if (!novoUsuario) return null;
		usuario = novoUsuario;
	}
	if (process.env.ENVIRONMENT == 'local') return usuario;
	try {
		await ldap.bind(`${login}${process.env.LDAP_DOMAIN}`, senha);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		usuario = null;
	}
	await ldap.unbind();
	return usuario;
}

async function buscarPorLogin(
	login: string,
): Promise<{ nome: string; email: string; login: string } | null> {
	if (!login || login === '') return null;
	let resposta = null;
	console.log({ login });
	try {
		await ldap.bind(
			`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`,
			process.env.LDAP_PASS || '',
		);
		const usuario = await ldap.search(process.env.LDAP_BASE || '', {
			filter: `(&(samaccountname=${login})(|(company=SMUL)(company=SPURBANISMO)))`,
			attributes: ['name', 'mail'],
			scope: 'sub',
		});
		const { name, mail } = usuario.searchEntries[0];
		const nome = name.toString();
		const email = mail.toString().toLowerCase();
		resposta = { nome, email, login };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {}
	ldap.unbind();
	return resposta;
}

async function buscarPorNome(
	nome: string,
): Promise<{ nome: string; email: string; login: string } | null> {
	if (!nome || nome === '') return null;
	let resposta = null;
	nome = nome.toLowerCase();
	try {
		await ldap.bind(
			`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`,
			process.env.LDAP_PASS || '',
		);
		const usuario = await ldap.search(process.env.LDAP_BASE || '', {
			filter: `(&(name=${nome})(|(company=SMUL)(company=SPURBANISMO)))`,
			attributes: ['samaccountname', 'mail', 'name'],
			scope: 'sub',
		});
		if (usuario.searchEntries && usuario.searchEntries.length > 0) {
			const { sAMAccountName, mail, name } = usuario.searchEntries[0];
			const login = sAMAccountName.toString();
			const email = mail.toString().toLowerCase();
			nome = name.toString();
			resposta = { nome, email, login };
		}
	} catch (err) {
		console.log(err);
	}
	ldap.unbind();
	return resposta;
}

async function buscarPorLoginOuNome(
	login: string,
	nome: string,
): Promise<{ nome: string; email: string; login: string } | null> {
	let resposta = buscarPorLogin(login);
	if (!resposta) resposta = buscarPorNome(nome);
	return resposta;
}

export { bind, buscarPorLogin, buscarPorNome, buscarPorLoginOuNome };
